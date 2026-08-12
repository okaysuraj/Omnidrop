import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { CartItem } from '../../database/entities/cart-item.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { Payment } from '../../database/entities/payment.entity';
import { DeliveryTask } from '../../database/entities/delivery-task.entity';
import { Store } from '../../database/entities/store.entity';
import { User } from '../../database/entities/user.entity';
import { OrderStatus, PaymentMethod, PaymentStatus, DeliveryStatus } from '../../common/enums';
import { WsGateway } from '../../websockets/ws.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Inventory) private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectQueue('orders') private ordersQueue: Queue,
    private wsGateway: WsGateway,
    private notificationsService: NotificationsService,
    private dataSource: DataSource,
  ) {}

  async findOne(id: string) {
    return this.orderRepository.findOne({
      where: { id },
      relations: { items: true, store: true, user: true },
    });
  }

  async checkout(userId: string, data: {
    deliveryAddress: string;
    deliveryLat: number;
    deliveryLng: number;
    deliveryInstructions?: string;
    paymentMethod: PaymentMethod;
    tip?: number;
    promotionCode?: string;
  }) {
    // Get cart items
    const cartItems = await this.cartItemRepository.find({ where: { userId } });
    if (cartItems.length === 0) throw new BadRequestException('Cart is empty');

    const storeId = cartItems[0].storeId;
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) throw new BadRequestException('Store not found');

    // Use a transaction for atomicity
    const result = await this.dataSource.transaction(async (manager) => {
      let subtotal = 0;
      const orderItems: Partial<OrderItem>[] = [];

      // Validate stock and build order items
      for (const cartItem of cartItems) {
        const inventory = await manager.findOne(Inventory, {
          where: { storeId: cartItem.storeId, productId: cartItem.productId },
          relations: { product: true },
        });

        if (!inventory || inventory.stock < cartItem.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${inventory?.product?.name || 'product'}`,
          );
        }

        const unitPrice = inventory.priceOverride || inventory.product.sellingPrice;
        subtotal += unitPrice * cartItem.quantity;

        orderItems.push({
          productId: cartItem.productId,
          name: inventory.product.name,
          quantity: cartItem.quantity,
          unitPrice,
        });

        // Decrement stock
        inventory.stock -= cartItem.quantity;
        await manager.save(inventory);
      }

      const deliveryFee = subtotal > 500 ? 0 : 30;
      const tip = data.tip || 0;
      const discount = 0; // TODO: Apply promotion
      const total = subtotal + deliveryFee + tip - discount;

      // Create order
      const order = manager.create(Order, {
        userId,
        storeId,
        status: OrderStatus.PENDING,
        subtotal,
        deliveryFee,
        discount,
        tip,
        total,
        deliveryAddress: data.deliveryAddress,
        deliveryLat: data.deliveryLat,
        deliveryLng: data.deliveryLng,
        deliveryInstructions: data.deliveryInstructions,
        paymentMethod: data.paymentMethod,
        promotionCode: data.promotionCode,
      });

      const savedOrder = await manager.save(order);

      // Create order items
      for (const item of orderItems) {
        const orderItem = manager.create(OrderItem, {
          ...item,
          orderId: savedOrder.id,
        });
        await manager.save(orderItem);
      }

      // Create payment record
      const payment = manager.create(Payment, {
        orderId: savedOrder.id,
        amount: total,
        status: data.paymentMethod === PaymentMethod.COD ? PaymentStatus.PENDING : PaymentStatus.PENDING,
        method: data.paymentMethod,
      });
      await manager.save(payment);

      // Create delivery task
      const deliveryTask = manager.create(DeliveryTask, {
        orderId: savedOrder.id,
        status: DeliveryStatus.PENDING,
        pickupLat: store.lat,
        pickupLng: store.lng,
        dropLat: data.deliveryLat,
        dropLng: data.deliveryLng,
        codAmount: data.paymentMethod === PaymentMethod.COD ? total : 0,
      });
      await manager.save(deliveryTask);

      // Clear cart
      await manager.delete(CartItem, { userId });

      this.logger.log(`Order created: ${savedOrder.id} for user ${userId}`);

      return {
        ...savedOrder,
        items: orderItems,
        payment,
        deliveryTask,
      };
    });
    
    // Add job to check acceptance after 10 minutes (600000 ms)
    await this.ordersQueue.add(
      'check-acceptance-timeout',
      { orderId: result.id },
      { delay: 600000 }
    );

    // Notify store
    this.wsGateway.emitNewOrder(storeId, result);
    
    const owner = await this.userRepository.findOne({ where: { id: store.ownerId } });
    if (owner?.fcmToken) {
      this.notificationsService.sendPushNotification(
        owner.fcmToken,
        'New Order Received! 📦',
        `Order #${result.id.slice(-6)} for ₹${result.total} from ${store.name}`,
        { orderId: result.id, type: 'NEW_ORDER' }
      );
    }

    return result;
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
    const where: any = { id };
    if (userId) where.userId = userId;

    const order = await this.orderRepository.findOne({
      where,
      relations: { items: { product: true }, store: true, payment: true, deliveryTask: { rider: true } },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByStore(storeId: string, status?: OrderStatus, page = 1, pageSize = 20) {
    const where: any = { storeId };
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

  async updateStatus(id: string, status: OrderStatus, updatedBy: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

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
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${status}`,
      );
    }

    order.status = status;
    await this.orderRepository.save(order);

    this.logger.log(`Order ${id} status updated to ${status} by ${updatedBy}`);
    
    this.wsGateway.emitOrderStatusUpdate(id, { status });
    
    if (status === OrderStatus.READY_FOR_PICKUP) {
      this.wsGateway.emitDeliveryRequest({ orderId: id, storeId: order.storeId });
    }

    // Notify customer
    const orderWithUser = await this.orderRepository.findOne({ where: { id }, relations: { user: true } });
    if (orderWithUser?.user?.fcmToken) {
      this.notificationsService.sendPushNotification(
        orderWithUser.user.fcmToken,
        'Order Update 🔔',
        `Your order #${id.slice(-6)} is now ${status.replace(/_/g, ' ')}`,
        { orderId: id, type: 'ORDER_UPDATE', status }
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

    // Restore stock
    for (const item of order.items) {
      const inventory = await this.inventoryRepository.findOne({
        where: { storeId: order.storeId, productId: item.productId },
      });
      if (inventory) {
        inventory.stock += item.quantity;
        await this.inventoryRepository.save(inventory);
      }
    }

    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);

    return order;
  }

  // Admin methods
  async findAll(page = 1, pageSize = 20, status?: OrderStatus) {
    const where: any = {};
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
    const total = await this.orderRepository.count();
    const pending = await this.orderRepository.count({ where: { status: OrderStatus.PENDING } });
    const delivered = await this.orderRepository.count({ where: { status: OrderStatus.DELIVERED } });
    const cancelled = await this.orderRepository.count({ where: { status: OrderStatus.CANCELLED } });

    const revenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .getRawOne();

    return {
      total,
      pending,
      delivered,
      cancelled,
      revenue: parseFloat(revenue?.total || '0'),
    };
  }
}
