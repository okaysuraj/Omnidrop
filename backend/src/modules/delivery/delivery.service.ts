import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryTask, Order, User, Store } from '../../database/entities';
import { DeliveryStatus, OrderStatus } from '../../common/enums';
import { WsGateway } from '../../websockets/ws.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  constructor(
    @InjectRepository(DeliveryTask) private deliveryTaskRepository: Repository<DeliveryTask>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    private wsGateway: WsGateway,
    private notificationsService: NotificationsService,
  ) {}

  async findAvailableTasks(riderLat: number, riderLng: number) {
    return this.deliveryTaskRepository.find({
      where: { status: DeliveryStatus.PENDING, riderId: null as any },
      relations: { order: { store: true } },
      order: { createdAt: 'ASC' },
      take: 20,
    });
  }

  async findMyTasks(riderId: string, status?: DeliveryStatus) {
    const where: any = { riderId };
    if (status) where.status = status;

    return this.deliveryTaskRepository.find({
      where,
      relations: { order: { store: true, user: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveTask(riderId: string) {
    return this.deliveryTaskRepository.findOne({
      where: [
        { riderId, status: DeliveryStatus.ACCEPTED },
        { riderId, status: DeliveryStatus.PICKED_UP },
        { riderId, status: DeliveryStatus.IN_TRANSIT },
      ],
      relations: { order: { store: true, items: true, user: true } },
    });
  }

  async acceptTask(taskId: string, riderId: string) {
    const task = await this.deliveryTaskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) throw new NotFoundException('Delivery task not found');
    if (task.status !== DeliveryStatus.PENDING) {
      throw new BadRequestException('Task is no longer available');
    }

    // Check if rider has an active task
    const activeTask = await this.findActiveTask(riderId);
    if (activeTask) {
      throw new BadRequestException('You already have an active delivery');
    }

    task.riderId = riderId;
    task.status = DeliveryStatus.ACCEPTED;
    await this.deliveryTaskRepository.save(task);

    // Update order status
    await this.orderRepository.update(task.orderId, { status: OrderStatus.PICKED_UP });

    this.logger.log(`Task ${taskId} accepted by rider ${riderId}`);
    return task;
  }

  async updateLocation(taskId: string, riderId: string, lat: number, lng: number) {
    const task = await this.deliveryTaskRepository.findOne({
      where: { id: taskId, riderId },
    });

    if (!task) throw new NotFoundException('Delivery task not found');

    task.currentLat = lat;
    task.currentLng = lng;

    // Calculate ETA (simplified: ~6 min per km)
    const distance = this.haversineDistance(lat, lng, task.dropLat, task.dropLng);
    task.etaMinutes = Math.max(1, Math.round(distance * 6));

    await this.deliveryTaskRepository.save(task);

    // Also update rider's current location
    await this.userRepository.update(riderId, { currentLat: lat, currentLng: lng });

    return { lat, lng, etaMinutes: task.etaMinutes };
  }

  async updateStatus(id: string, riderId: string, status: DeliveryStatus) {
    const task = await this.deliveryTaskRepository.findOne({
      where: { id, riderId },
      relations: { order: { user: true } },
    });

    if (!task) throw new NotFoundException('Delivery task not found');

    const validTransitions: Record<DeliveryStatus, DeliveryStatus[]> = {
      [DeliveryStatus.PENDING]: [DeliveryStatus.ASSIGNED, DeliveryStatus.CANCELLED],
      [DeliveryStatus.ASSIGNED]: [DeliveryStatus.ACCEPTED, DeliveryStatus.CANCELLED],
      [DeliveryStatus.ACCEPTED]: [DeliveryStatus.PICKED_UP, DeliveryStatus.CANCELLED],
      [DeliveryStatus.PICKED_UP]: [DeliveryStatus.IN_TRANSIT],
      [DeliveryStatus.IN_TRANSIT]: [DeliveryStatus.DELIVERED],
      [DeliveryStatus.DELIVERED]: [],
      [DeliveryStatus.CANCELLED]: [],
    };

    if (!validTransitions[task.status]?.includes(status)) {
      throw new BadRequestException(`Cannot transition from ${task.status} to ${status}`);
    }

    task.status = status;

    await this.deliveryTaskRepository.save(task);

    this.logger.log(`Task ${id} status updated to ${status} by rider ${riderId}`);
    this.wsGateway.emitDeliveryUpdate(id, { status });

    // Sync order status
    let orderStatus: OrderStatus | null = null;
    if (status === DeliveryStatus.PICKED_UP) orderStatus = OrderStatus.PICKED_UP;
    if (status === DeliveryStatus.IN_TRANSIT) orderStatus = OrderStatus.OUT_FOR_DELIVERY;
    if (status === DeliveryStatus.DELIVERED) orderStatus = OrderStatus.DELIVERED;
    
    if (orderStatus) {
      task.order.status = orderStatus;
      await this.orderRepository.save(task.order);
      this.wsGateway.emitOrderStatusUpdate(task.orderId, { status: orderStatus });
      
      // Notify customer
      if (task.order.user?.fcmToken) {
        let title = 'Delivery Update';
        let body = `Your order is now ${orderStatus.replace(/_/g, ' ')}`;
        if (orderStatus === OrderStatus.OUT_FOR_DELIVERY) {
          title = 'Out for Delivery! 🛵';
          body = 'Your rider is on the way with your order.';
        } else if (orderStatus === OrderStatus.DELIVERED) {
          title = 'Order Delivered! 🎉';
          body = 'Enjoy your items! Please rate your experience.';
        }
        
        this.notificationsService.sendPushNotification(
          task.order.user.fcmToken,
          title,
          body,
          { orderId: task.orderId, type: 'DELIVERY_UPDATE', status: orderStatus }
        );
      }
    }

    return task;
  }

  async toggleAvailability(riderId: string) {
    const rider = await this.userRepository.findOne({ where: { id: riderId } });
    if (!rider) throw new NotFoundException('Rider not found');

    rider.isAvailable = !rider.isAvailable;
    await this.userRepository.save(rider);

    return { isAvailable: rider.isAvailable };
  }

  async getEarnings(riderId: string) {
    const tasks = await this.deliveryTaskRepository.find({
      where: { riderId, status: DeliveryStatus.DELIVERED },
      relations: { order: true },
    });

    const totalEarnings = tasks.reduce((sum, task) => sum + (task.order?.tip || 0) + 40, 0); // 40 base per delivery
    const todayEarnings = tasks
      .filter((t) => {
        const today = new Date();
        return t.deliveredAt && t.deliveredAt.toDateString() === today.toDateString();
      })
      .reduce((sum, task) => sum + (task.order?.tip || 0) + 40, 0);

    return {
      totalDeliveries: tasks.length,
      totalEarnings,
      todayEarnings,
      todayDeliveries: tasks.filter((t) => {
        const today = new Date();
        return t.deliveredAt && t.deliveredAt.toDateString() === today.toDateString();
      }).length,
    };
  }

  // Admin: manual assignment
  async assignRider(taskId: string, riderId: string) {
    const task = await this.deliveryTaskRepository.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    task.riderId = riderId;
    task.status = DeliveryStatus.ASSIGNED;
    await this.deliveryTaskRepository.save(task);

    return task;
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }
}
