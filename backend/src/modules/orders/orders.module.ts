import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem, Inventory, Order, Store, User } from '../../database/entities';
import { PromotionsModule } from '../promotions/promotions.module';
import { CheckoutService } from './checkout.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, CartItem, Inventory, Store, User]), PromotionsModule],
  controllers: [OrdersController],
  providers: [OrdersService, CheckoutService],
  exports: [OrdersService],
})
export class OrdersModule {}
