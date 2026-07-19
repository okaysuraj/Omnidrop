import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order } from '../../database/entities';

// import Razorpay from 'razorpay'; // Requires: npm i razorpay

@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);
  private instance: any;

  constructor(private configService: ConfigService) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (keyId && keySecret) {
      /* Placeholder for razorpay instance initialization
      this.instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      */
      this.logger.log('Razorpay initialized with keys');
    } else {
      this.logger.warn('Razorpay keys not found. Running in mock mode.');
    }
  }

  async createOrder(order: Order, amountInRupees: number) {
    try {
      if (this.instance) {
        /*
        const options = {
          amount: amountInRupees * 100, // amount in smallest currency unit
          currency: 'INR',
          receipt: order.id,
        };
        const razorpayOrder = await this.instance.orders.create(options);
        return {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        };
        */
      }
      
      // Mock order creation for development if no keys
      return {
        id: `mock_rzp_order_${Date.now()}`,
        amount: amountInRupees * 100,
        currency: 'INR',
        mock: true
      };
    } catch (error) {
      this.logger.error(`Error creating Razorpay order: ${error.message}`);
      throw error;
    }
  }
}
