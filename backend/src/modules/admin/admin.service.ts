import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Order, Store } from '../../database/entities';
import { OrderStatus, UserRole } from '../../common/enums';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
  ) {}

  async getDashboardStats() {
    // Total Revenue (Only completed/delivered orders)
    const revenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'totalRevenue')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .getRawOne();
      
    const totalRevenue = revenueResult?.totalRevenue || 0;

    // Total Orders
    const totalOrders = await this.orderRepository.count();

    // Active Users (count of users who are active)
    const activeUsers = await this.userRepository.count({ where: { isActive: true } });

    // Users breakdown
    const customersCount = await this.userRepository.count({ where: { role: UserRole.CUSTOMER } });
    const shopkeepersCount = await this.userRepository.count({ where: { role: UserRole.SHOPKEEPER } });
    const ridersCount = await this.userRepository.count({ where: { role: UserRole.DELIVERY_PARTNER } });

    // Store stats
    const totalStores = await this.storeRepository.count();
    const verifiedStores = await this.storeRepository.count({ where: { isVerified: true } });

    return {
      revenue: parseFloat(totalRevenue),
      orders: {
        total: totalOrders,
      },
      users: {
        totalActive: activeUsers,
        customers: customersCount,
        shopkeepers: shopkeepersCount,
        riders: ridersCount,
      },
      stores: {
        total: totalStores,
        verified: verifiedStores,
        unverified: totalStores - verifiedStores,
      },
      recentOrders: await this.orderRepository.find({
        order: { createdAt: 'DESC' },
        take: 5,
        relations: { store: true },
      }),
    };
  }
}
