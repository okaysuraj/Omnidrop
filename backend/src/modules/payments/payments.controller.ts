import { Controller, Post, Req, Res, Headers, BadRequestException, Logger, RawBodyRequest, Body } from '@nestjs/common';
import type { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { RazorpayService } from './razorpay.service';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../../common/enums';
import { Public } from '../../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private stripeService: StripeService,
    private razorpayService: RazorpayService,
    private ordersService: OrdersService,
  ) {}

  @Post('intent')
  async createIntent(@Req() req: any, @Body('orderId') orderId: string) {
    if (!orderId) throw new BadRequestException('Order ID is required');

    const order = await this.ordersService.findOne(orderId);
    if (!order) throw new BadRequestException('Order not found');
    if (order.userId !== req.user.id) throw new BadRequestException('Not authorized for this order');
    if (order.paymentMethod === 'COD') throw new BadRequestException('Order is COD');

    if (order.paymentMethod === 'UPI' || order.paymentMethod === 'WALLET') {
      const rzpOrder = await this.razorpayService.createOrder(order, order.total);
      return { provider: 'razorpay', orderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency };
    } else {
      const intent = await this.stripeService.createPaymentIntent(order.total, 'inr', { orderId: order.id });
      return { provider: 'stripe', clientSecret: intent.client_secret };
    }
  }

  @Public()
  @Post('webhook')
  async handleWebhook(
    @Req() req: any,
    @Res() res: any,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    let event;
    try {
      const rawReq = req as RawBodyRequest<Request>;
      const expressRes = res as Response;
      // NestJS rawBody requires { rawBody: true } in NestFactory
      event = this.stripeService.constructEvent(rawReq.rawBody!, signature);
    } catch (err) {
      this.logger.error(`Webhook error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as any;
      const orderId = paymentIntent.metadata.orderId;
      
      this.logger.log(`PaymentIntent succeeded for Order ID: ${orderId}`);
      
      if (orderId) {
        // Update order status to CONFIRMED or PREPARING based on flow
        try {
          await this.ordersService.updateStatus(orderId, OrderStatus.CONFIRMED, 'system');
          this.logger.log(`Successfully confirmed Order ${orderId} via Stripe Webhook`);
        } catch (e) {
          this.logger.error(`Failed to update order status for ${orderId}: ${e.message}`);
        }
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    const expressRes = res as Response;
    expressRes.json({ received: true });
  }
}
