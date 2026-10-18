import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Store, User } from '../../database/entities';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, Store])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
