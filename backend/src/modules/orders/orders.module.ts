import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersProcessor } from './orders.processor';
import { Order, OrderItem, CartItem, Inventory, Payment, DeliveryTask, Store, User } from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, CartItem, Inventory, Payment, DeliveryTask, Store, User]),
    BullModule.registerQueue({
      name: 'orders',
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersProcessor],
  exports: [OrdersService],
})
export class OrdersModule {}
