import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Store, User } from '../database/entities';
import { WsGateway } from './ws.gateway';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Order, Store])],
  providers: [WsGateway],
  exports: [WsGateway],
})
export class WsModule {}
