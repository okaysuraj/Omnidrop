import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, LessThan, Repository } from 'typeorm';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  UserRole,
  WalletTransactionType,
} from '../../common/enums';
import { getErrorMessage } from '../../common/errors';
import { Inventory } from '../../database/entities/inventory.entity';
import { Order } from '../../database/entities/order.entity';
import { Payment } from '../../database/entities/payment.entity';
import { Store } from '../../database/entities/store.entity';
import { User } from '../../database/entities/user.entity';
import { WalletTransaction } from '../../database/entities/wallet-transaction.entity';
import { Wallet } from '../../database/entities/wallet.entity';
import { WsGateway } from '../../websockets/ws.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import type { CheckoutInput } from './checkout.service';
import { CheckoutService } from './checkout.service';

@Injectable()
export class OrdersService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Inventory) private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    private wsGateway: WsGateway,
    private notificationsService: NotificationsService,
    private checkoutService: CheckoutService,
    private dataSource: DataSource,
  ) {}

  private sweepTimer?: ReturnType<typeof setInterval>;
  private readonly acceptanceTimers = new Set<ReturnType<typeof setTimeout>>();

  onModuleDestroy() {
    clearInterval(this.sweepTimer);
    for (const timer of this.acceptanceTimers) clearTimeout(timer);
    this.acceptanceTimers.clear();
  }

  onModuleInit() {
    // Initial sweep to auto-cancel any unaccepted orders across server restarts
    this.sweepExpiredPendingOrders().catch((err) => {
      this.logger.error(`Initial pending order sweep failed: ${getErrorMessage(err)}`);
    });

    // Persistent recurring sweep every 60 seconds
    this.sweepTimer = setInterval(() => {
      this.sweepExpiredPendingOrders().catch((err) => {
        this.logger.error(`Recurring pending order sweep failed: ${getErrorMessage(err)}`);
      });
    }, 60000);
  }

  async sweepExpiredPendingOrders() {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const expiredOrders = await this.orderRepository.find({
      where: {
        status: OrderStatus.PENDING,
        createdAt: LessThan(tenMinutesAgo),
      },
      relations: { items: true },
    });

    for (const order of expiredOrders) {
      await this.handleAcceptanceTimeout(order.id);
    }
  }

  async findOne(id: string) {
    return this.orderRepository.findOne({
      where: { id },
      relations: { items: true, store: true, user: true },
    });
  }

  async checkout(userId: string, data: CheckoutInput) {
    const order = await this.checkoutService.checkout(userId, data);
    const timer = setTimeout(
      () => {
        this.acceptanceTimers.delete(timer);
        void this.handleAcceptanceTimeout(order.id).catch((error: Error) => {
          this.logger.error('Order acceptance timeout failed', error.stack);
        });
      },
      10 * 60 * 1000,
    );
    this.acceptanceTimers.add(timer);
    return order;
  }

  async refundOrderIfApplicable(order: Order, reason = 'Order Cancelled') {
    if (order.paymentMethod === PaymentMethod.WALLET && Number(order.total) > 0) {
      try {
        await this.dataSource.transaction(async (manager) => {
          const wallet = await manager.findOne(Wallet, { where: { userId: order.userId } });
          if (wallet) {
            const currentBalance = parseFloat(Number(wallet.balance).toString());
            const refundAmount = parseFloat(Number(order.total).toString());
            wallet.balance = parseFloat((currentBalance + refundAmount).toFixed(2));
            await manager.save(wallet);

            const refundTx = manager.create(WalletTransaction, {
              walletId: wallet.id,
              amount: refundAmount,
              type: WalletTransactionType.CREDIT,
              referenceId: `refund_${order.id}`,
              description: `Refund: ${reason} (#${order.id.slice(-6)})`,
            });
            await manager.save(refundTx);
          }
        });
      } catch (err) {
        this.logger.error(`Failed to refund wallet for order ${order.id}: ${getErrorMessage(err)}`);
      }
    }

    try {
      const paymentRepo = this.dataSource.getRepository(Payment);
      const payment = await paymentRepo.findOne({ where: { orderId: order.id } });
      if (payment) {
        payment.status = PaymentStatus.REFUNDED;
        await paymentRepo.save(payment);
      }
    } catch (err) {
      this.logger.warn(
        `Could not update payment status on refund for order ${order.id}: ${getErrorMessage(err)}`,
      );
    }
  }

  async markPaymentCompleted(orderId: string, stripePaymentId?: string) {
    const paymentRepo = this.dataSource.getRepository(Payment);
    const payment = await paymentRepo.findOne({ where: { orderId } });
    if (payment) {
      payment.status = PaymentStatus.COMPLETED;
      if (stripePaymentId) {
        payment.stripePaymentId = stripePaymentId;
      }
      await paymentRepo.save(payment);
    }
  }

  async handleAcceptanceTimeout(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { items: true },
    });

    if (!order) return;

    // If order is still PENDING after 10 minutes, auto-cancel it
    if (order.status === OrderStatus.PENDING) {
      this.logger.warn(`Order ${orderId} auto-cancelled due to shopkeeper timeout`);

      order.status = OrderStatus.CANCELLED;
      await this.orderRepository.save(order);

      await this.restoreStock(order);

      // Process wallet / payment refund if applicable
      await this.refundOrderIfApplicable(order, 'Store Acceptance Timeout');

      // Notify users via WebSocket
      this.wsGateway.emitOrderStatusUpdate(orderId, {
        status: OrderStatus.CANCELLED,
        reason: 'Store took too long to accept the order.',
      });
    }
  }

  async findByUser(userId: string, page = 1, pageSize = 10) {
    const [items, total] = await this.orderRepository.findAndCount({
      where: { userId },
      relations: { items: true, store: true, payment: true, deliveryTask: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findById(id: string, userId?: string) {
    const where: FindOptionsWhere<Order> = { id };
    if (userId) where.userId = userId;

    const order = await this.orderRepository.findOne({
      where,
      relations: {
        items: { product: true },
        store: true,
        payment: true,
        deliveryTask: { rider: true },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByStore(storeId: string, user?: User, status?: OrderStatus, page = 1, pageSize = 20) {
    if (user && user.role !== UserRole.ADMIN) {
      const store = await this.storeRepository.findOne({ where: { id: storeId } });
      if (!store) throw new NotFoundException('Store not found');
      if (store.ownerId !== user.id) {
        throw new ForbiddenException('You do not have permission to view orders for this store');
      }
    }

    const where: FindOptionsWhere<Order> = { storeId };
    if (status) where.status = status;

    const [items, total] = await this.orderRepository.findAndCount({
      where,
      relations: { items: true, user: true, payment: true, deliveryTask: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async updateStatus(id: string, status: OrderStatus, updatedBy: string, user?: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { store: true, deliveryTask: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    // Verify actor authorization if initiated by a user
    if (user && user.role !== UserRole.ADMIN && updatedBy !== 'system') {
      const isStoreOwner = order.store?.ownerId === user.id;
      const isAssignedRider = order.deliveryTask?.riderId === user.id;
      const merchantTransitions = [
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
        OrderStatus.READY_FOR_PICKUP,
        OrderStatus.CANCELLED,
      ];
      const riderTransitions = [
        OrderStatus.PICKED_UP,
        OrderStatus.OUT_FOR_DELIVERY,
        OrderStatus.DELIVERED,
      ];

      if (merchantTransitions.includes(status) && !isStoreOwner) {
        throw new ForbiddenException(
          'Only the store owner can perform preparation state updates on this order',
        );
      }
      if (riderTransitions.includes(status) && !isAssignedRider) {
        throw new ForbiddenException(
          'Only the assigned delivery partner can update delivery progress',
        );
      }
    }

    // Validate status transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED],
      [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.PICKED_UP],
      [OrderStatus.PICKED_UP]: [OrderStatus.OUT_FOR_DELIVERY],
      [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new BadRequestException(`Cannot transition from ${order.status} to ${status}`);
    }

    order.status = status;
    await this.orderRepository.save(order);

    this.wsGateway.emitOrderStatusUpdate(id, { status });

    if (status === OrderStatus.READY_FOR_PICKUP) {
      this.wsGateway.emitDeliveryRequest({ orderId: id, storeId: order.storeId });
    }

    // Notify customer
    const orderWithUser = await this.orderRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (orderWithUser?.user?.fcmToken) {
      void this.notificationsService.sendPushNotification(
        orderWithUser.user.fcmToken,
        'Order Update 🔔',
        `Your order #${id.slice(-6)} is now ${status.replace(/_/g, ' ')}`,
        { orderId: id, type: 'ORDER_UPDATE', status },
      );
    }

    return order;
  }

  async cancelOrder(id: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
      relations: { items: true },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    await this.restoreStock(order);

    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);

    // Process wallet / payment refund if applicable
    await this.refundOrderIfApplicable(order, 'User Cancelled');

    // Notify rooms via WebSocket
    this.wsGateway.emitOrderStatusUpdate(id, {
      status: OrderStatus.CANCELLED,
      reason: 'Cancelled by customer',
    });

    return order;
  }

  private async restoreStock(order: Order) {
    for (const item of order.items) {
      const inventory = await this.inventoryRepository.findOne({
        where: { storeId: order.storeId, productId: item.productId },
      });
      if (inventory) {
        inventory.stock += item.quantity;
        await this.inventoryRepository.save(inventory);
      }
    }
  }

  // Admin methods
  async findAll(page = 1, pageSize = 20, status?: OrderStatus) {
    const where: FindOptionsWhere<Order> = {};
    if (status) where.status = status;

    const [items, total] = await this.orderRepository.findAndCount({
      where,
      relations: { user: true, store: true, payment: true, deliveryTask: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getStats() {
    const [total, pending, delivered, cancelled, inTransit] = await Promise.all([
      this.orderRepository.count(),
      this.orderRepository.count({ where: { status: OrderStatus.PENDING } }),
      this.orderRepository.count({ where: { status: OrderStatus.DELIVERED } }),
      this.orderRepository.count({ where: { status: OrderStatus.CANCELLED } }),
      this.orderRepository.count({ where: { status: OrderStatus.OUT_FOR_DELIVERY } }),
    ]);

    const revenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .getRawOne<{ total: string | null }>();

    return {
      total,
      pending,
      inTransit,
      delivered,
      cancelled,
      revenue: parseFloat(revenue?.total || '0'),
    };
  }
}
