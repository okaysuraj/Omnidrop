import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { getAuth } from 'firebase-admin/auth';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { UserRole } from '../common/enums';
import { getErrorMessage } from '../common/errors';
import { Order, Store, User } from '../database/entities';

type AuthenticatedSocket = Omit<Socket, 'data'> & { data: { user?: User } };

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/',
})
export class WsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WsGateway.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const auth = client.handshake.auth as { token?: unknown };
      const header = client.handshake.headers.authorization;
      const token = typeof auth.token === 'string' ? auth.token : header?.replace(/^Bearer /, '');

      if (token) {
        try {
          const decoded = await getAuth().verifyIdToken(token);
          const user = await this.userRepository.findOne({
            where: { firebaseUid: decoded.uid, isActive: true },
          });
          if (user) {
            client.data.user = user;

            return;
          }
        } catch (authErr) {
          this.logger.warn(
            `Firebase token verification failed for socket ${client.id}: ${getErrorMessage(authErr)}`,
          );
        }
      }

      // If in production and unauthenticated, close connection
      if (process.env.NODE_ENV === 'production') {
        this.logger.warn(`Rejecting unauthenticated socket connection ${client.id} in production`);
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
      }
    } catch (err) {
      this.logger.error(`Error during socket connection handshake: ${getErrorMessage(err)}`);
      client.disconnect();
    }
  }

  // Room management
  @SubscribeMessage('room:join_order')
  async handleJoinOrderRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { orderId: string },
  ) {
    if (!data?.orderId) return;

    const user: User | undefined = client.data.user;
    if (process.env.NODE_ENV === 'production' && !user) {
      client.emit('error', { message: 'Authentication required' });
      return;
    }

    if (user && user.role !== UserRole.ADMIN) {
      const order = await this.orderRepository.findOne({
        where: { id: data.orderId },
        relations: { store: true, deliveryTask: true },
      });

      if (!order) {
        client.emit('error', { message: 'Order not found' });
        return;
      }

      const isCustomer = order.userId === user.id;
      const isStoreOwner = order.store?.ownerId === user.id;
      const isRider = order.deliveryTask?.riderId === user.id;

      if (!isCustomer && !isStoreOwner && !isRider) {
        this.logger.warn(
          `Unauthorized attempt to join order room ${data.orderId} by user ${user.id}`,
        );
        client.emit('error', { message: 'Unauthorized room access' });
        return;
      }
    }

    void client.join(`order:${data.orderId}`);
  }

  @SubscribeMessage('room:leave_order')
  handleLeaveOrderRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { orderId: string },
  ) {
    if (data?.orderId) {
      void client.leave(`order:${data.orderId}`);
    }
  }

  @SubscribeMessage('room:join_store')
  async handleJoinStoreRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { storeId: string },
  ) {
    if (!data?.storeId) return;

    const user: User | undefined = client.data.user;
    if (process.env.NODE_ENV === 'production' && !user) {
      client.emit('error', { message: 'Authentication required' });
      return;
    }

    if (user && user.role !== UserRole.ADMIN) {
      const store = await this.storeRepository.findOne({ where: { id: data.storeId } });
      if (!store || store.ownerId !== user.id) {
        this.logger.warn(
          `Unauthorized attempt to join store room ${data.storeId} by user ${user.id}`,
        );
        client.emit('error', { message: 'Unauthorized store room access' });
        return;
      }
    }

    void client.join(`store:${data.storeId}`);
  }

  @SubscribeMessage('room:leave_store')
  handleLeaveStoreRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { storeId: string },
  ) {
    if (data?.storeId) {
      void client.leave(`store:${data.storeId}`);
    }
  }

  @SubscribeMessage('room:join_rider')
  handleJoinRiderRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { riderId: string },
  ) {
    if (!data?.riderId) return;

    const user: User | undefined = client.data.user;
    if (process.env.NODE_ENV === 'production' && !user) {
      client.emit('error', { message: 'Authentication required' });
      return;
    }

    if (user && user.role !== UserRole.ADMIN && user.id !== data.riderId) {
      client.emit('error', { message: 'Unauthorized rider room access' });
      return;
    }

    void client.join(`rider:${data.riderId}`);
  }

  @SubscribeMessage('delivery:location_update')
  handleDeliveryLocationUpdate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { orderId: string; taskId: string; lat: number; lng: number },
  ) {
    const user: User | undefined = client.data.user;
    if (
      process.env.NODE_ENV === 'production' &&
      (!user || (user.role !== UserRole.DELIVERY_PARTNER && user.role !== UserRole.ADMIN))
    ) {
      client.emit('error', { message: 'Unauthorized GPS telemetry update' });
      return;
    }

    // Broadcast the update to anyone in the order room (i.e. the customer watching the map)
    this.emitDeliveryLocationUpdate(data.orderId, {
      lat: data.lat,
      lng: data.lng,
      taskId: data.taskId,
    });
  }

  @SubscribeMessage('rider:location')
  handleRiderLocation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { lat: number; lng: number; orderId?: string; taskId?: string },
  ) {
    const user: User | undefined = client.data.user;
    if (
      process.env.NODE_ENV === 'production' &&
      (!user || (user.role !== UserRole.DELIVERY_PARTNER && user.role !== UserRole.ADMIN))
    ) {
      client.emit('error', { message: 'Unauthorized GPS telemetry update' });
      return;
    }

    if (data.orderId) {
      this.emitDeliveryLocationUpdate(data.orderId, {
        lat: data.lat,
        lng: data.lng,
        taskId: data.taskId,
      });
    }
  }

  // Emit methods (called from services)
  emitOrderStatusUpdate(orderId: string, data: object) {
    this.server.to(`order:${orderId}`).emit('order:status_updated', {
      orderId,
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  emitDeliveryLocationUpdate(orderId: string, data: object) {
    this.server.to(`order:${orderId}`).emit('delivery:location_updated', {
      orderId,
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  emitNewOrder(storeId: string, data: object) {
    this.server.to(`store:${storeId}`).emit('order:new', {
      storeId,
      ...data,
    });
  }

  emitDeliveryRequest(data: object) {
    this.server.emit('delivery:request', data);
  }

  emitDeliveryUpdate(taskId: string, data: object) {
    this.server.emit('delivery:status_updated', {
      taskId,
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  emitInventoryUpdate(storeId: string, data: object) {
    this.server.to(`store:${storeId}`).emit('inventory:updated', {
      storeId,
      ...data,
    });
  }
}
