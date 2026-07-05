import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, Store, Order } from '../../database/entities';
import { OrderStatus } from '../../common/enums';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async create(userId: string, data: {
    orderId: string;
    storeRating?: number;
    riderRating?: number;
    comment?: string;
  }) {
    const order = await this.orderRepository.findOne({
      where: { id: data.orderId, userId },
      relations: { deliveryTask: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.DELIVERED) throw new BadRequestException('Can only review delivered orders');

    const existing = await this.reviewRepository.findOne({ where: { orderId: data.orderId } });
    if (existing) throw new BadRequestException('Review already submitted');

    const review = this.reviewRepository.create({
      userId,
      storeId: order.storeId,
      riderId: order.deliveryTask?.riderId,
      ...data,
    });
    await this.reviewRepository.save(review);

    // Update store rating
    if (data.storeRating) {
      const store = await this.storeRepository.findOne({ where: { id: order.storeId } });
      if (store) {
        const newTotal = store.totalRatings + 1;
        store.rating = parseFloat(((store.rating * store.totalRatings + data.storeRating) / newTotal).toFixed(2));
        store.totalRatings = newTotal;
        await this.storeRepository.save(store);
      }
    }

    return review;
  }

  async findByStore(storeId: string, page = 1, pageSize = 10) {
    const [items, total] = await this.reviewRepository.findAndCount({
      where: { storeId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
}
