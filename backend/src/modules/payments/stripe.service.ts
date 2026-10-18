import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { getErrorMessage } from '../../common/errors';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_mock';
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2026-06-24.dahlia',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'inr',
    metadata: Stripe.MetadataParam = {},
  ) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amounts in cents/paise
        currency,
        metadata,
      });
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Error creating PaymentIntent: ${getErrorMessage(error)}`);
      throw new InternalServerErrorException('Failed to initialize payment');
    }
  }

  constructEvent(payload: string | Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || 'whsec_mock';
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${getErrorMessage(err)}`);
      throw err;
    }
  }
}
