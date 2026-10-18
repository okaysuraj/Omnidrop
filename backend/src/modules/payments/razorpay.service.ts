import { Injectable } from '@nestjs/common';

@Injectable()
export class RazorpayService {
  // UPI is a development stub until a real Razorpay integration is implemented.
  createOrder(amountInRupees: number) {
    return {
      id: 'mock_rzp_order_' + Date.now(),
      amount: amountInRupees * 100,
      currency: 'INR',
      mock: true,
    };
  }
}
