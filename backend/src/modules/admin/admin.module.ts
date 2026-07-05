import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, Order, Store } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, Store])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
