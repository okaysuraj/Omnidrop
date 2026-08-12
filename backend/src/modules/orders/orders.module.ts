import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersProcessor } from './orders.processor';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { CartItem } from '../../database/entities/cart-item.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { Payment } from '../../database/entities/payment.entity';
import { DeliveryTask } from '../../database/entities/delivery-task.entity';
import { Store } from '../../database/entities/store.entity';
import { User } from '../../database/entities/user.entity';

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
