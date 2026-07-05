import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
  namespace: '/',
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Room management
  @SubscribeMessage('room:join_order')
  handleJoinOrderRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ) {
    client.join(`order:${data.orderId}`);
    this.logger.log(`Client ${client.id} joined order room: ${data.orderId}`);
  }

  @SubscribeMessage('room:leave_order')
  handleLeaveOrderRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ) {
    client.leave(`order:${data.orderId}`);
  }

  @SubscribeMessage('room:join_store')
  handleJoinStoreRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { storeId: string },
  ) {
    client.join(`store:${data.storeId}`);
    this.logger.log(`Client ${client.id} joined store room: ${data.storeId}`);
  }

  @SubscribeMessage('room:leave_store')
  handleLeaveStoreRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { storeId: string },
  ) {
    client.leave(`store:${data.storeId}`);
  }

  @SubscribeMessage('room:join_rider')
  handleJoinRiderRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { riderId: string },
  ) {
    client.join(`rider:${data.riderId}`);
  }

  @SubscribeMessage('delivery:location_update')
  handleDeliveryLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string, taskId: string, lat: number, lng: number },
  ) {
    // Broadcast the update to anyone in the order room (i.e. the customer watching the map)
    this.emitDeliveryLocationUpdate(data.orderId, {
      lat: data.lat,
      lng: data.lng,
      taskId: data.taskId,
    });
  }

  // Emit methods (called from services)
  emitOrderStatusUpdate(orderId: string, data: any) {
    this.server.to(`order:${orderId}`).emit('order:status_updated', {
      orderId,
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  emitDeliveryLocationUpdate(orderId: string, data: any) {
    this.server.to(`order:${orderId}`).emit('delivery:location_updated', {
      orderId,
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  emitNewOrder(storeId: string, data: any) {
    this.server.to(`store:${storeId}`).emit('order:new', {
      storeId,
      ...data,
    });
  }

  emitDeliveryRequest(data: any) {
    this.server.emit('delivery:request', data);
  }

  emitDeliveryUpdate(taskId: string, data: any) {
    this.server.emit('delivery:status_updated', {
      taskId,
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  emitInventoryUpdate(storeId: string, data: any) {
    this.server.to(`store:${storeId}`).emit('inventory:updated', {
      storeId,
      ...data,
    });
  }
}
