import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { DeliveryTask, Order, User, Store } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryTask, Order, User, Store])],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
