import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { WalletModule } from '../wallet/wallet.module';
import { PaymentsController } from './payments.controller';
import { RazorpayService } from './razorpay.service';
import { StripeService } from './stripe.service';

@Module({
  imports: [OrdersModule, WalletModule],
  controllers: [PaymentsController],
  providers: [StripeService, RazorpayService],
  exports: [StripeService, RazorpayService],
})
export class PaymentsModule {}
