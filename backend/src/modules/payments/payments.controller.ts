import type { RawBodyRequest } from '@nestjs/common';
import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { OrderStatus, PaymentMethod } from '../../common/enums';
import { getErrorMessage } from '../../common/errors';
import { User } from '../../database/entities';
import { OrdersService } from '../orders/orders.service';
import { WalletService } from '../wallet/wallet.service';
import { RazorpayService } from './razorpay.service';
import { StripeService } from './stripe.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private stripeService: StripeService,
    private razorpayService: RazorpayService,
    private ordersService: OrdersService,
    private walletService: WalletService,
  ) {}

  @Post('intent')
  async createIntent(@CurrentUser() user: User, @Body('orderId') orderId: string) {
    if (!orderId) throw new BadRequestException('Order ID is required');

    const order = await this.ordersService.findOne(orderId);
    if (!order) throw new BadRequestException('Order not found');
    if (order.userId !== user.id) throw new BadRequestException('Not authorized for this order');
    if (order.paymentMethod === PaymentMethod.COD) throw new BadRequestException('Order is COD');

    if (order.paymentMethod === PaymentMethod.WALLET) {
      return {
        provider: 'wallet',
        status: 'PAID',
        message: 'Order balance settled via Omni Wallet',
      };
    }

    if (order.paymentMethod === PaymentMethod.UPI) {
      const rzpOrder = this.razorpayService.createOrder(order.total);
      return {
        provider: 'razorpay',
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
      };
    } else {
      const intent = await this.stripeService.createPaymentIntent(order.total, 'inr', {
        orderId: order.id,
      });
      return { provider: 'stripe', clientSecret: intent.client_secret };
    }
  }

  @Post('wallet-intent')
  async createWalletIntent(@CurrentUser() user: User, @Body('amount') amount: number) {
    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || numAmount < 10 || numAmount > 50000) {
      throw new BadRequestException('Wallet top-up amount must be between ₹10 and ₹50,000');
    }

    const intent = await this.stripeService.createPaymentIntent(numAmount, 'inr', {
      type: 'WALLET_TOPUP',
      userId: user.id,
      amount: numAmount.toString(),
    });

    return {
      provider: 'stripe',
      clientSecret: intent.client_secret,
      amount: numAmount,
      currency: 'inr',
    };
  }

  @Public()
  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    let event;
    try {
      // NestJS rawBody requires { rawBody: true } in NestFactory
      event = this.stripeService.constructEvent(req.rawBody!, signature);
    } catch (err) {
      this.logger.error(`Webhook error: ${getErrorMessage(err)}`);
      return res.status(400).send(`Webhook Error: ${getErrorMessage(err)}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata || {};

      if (metadata.type === 'WALLET_TOPUP') {
        const userId = metadata.userId;
        const topupAmount = parseFloat(metadata.amount);
        if (userId && topupAmount > 0) {
          try {
            await this.walletService.topup(
              userId,
              topupAmount,
              paymentIntent.id,
              'Verified Stripe Payment Deposit',
            );
          } catch (e) {
            this.logger.error(`Failed to credit wallet for user ${userId}: ${getErrorMessage(e)}`);
          }
        }
      } else {
        const orderId = metadata.orderId;

        if (orderId) {
          try {
            await this.ordersService.updateStatus(orderId, OrderStatus.CONFIRMED, 'system');
            await this.ordersService.markPaymentCompleted(orderId, paymentIntent.id);
          } catch (e) {
            this.logger.error(
              `Failed to update order/payment status for ${orderId}: ${getErrorMessage(e)}`,
            );
          }
        }
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  }
}
