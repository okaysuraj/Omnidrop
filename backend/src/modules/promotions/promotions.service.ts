import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Promotion } from '../../database/entities';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion) private promotionRepository: Repository<Promotion>,
  ) {}

  async create(data: Partial<Promotion>) {
    const promo = this.promotionRepository.create(data);
    return this.promotionRepository.save(promo);
  }

  async findAll(page = 1, pageSize = 20) {
    const [items, total] = await this.promotionRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findActive() {
    const now = new Date();
    return this.promotionRepository.find({
      where: {
        isActive: true,
        startsAt: LessThanOrEqual(now),
        expiresAt: MoreThanOrEqual(now),
      },
    });
  }

  async validate(code: string, orderTotal: number) {
    const promo = await this.promotionRepository.findOne({ where: { code, isActive: true } });
    if (!promo) throw new NotFoundException('Promotion not found');

    const now = new Date();
    if (now < promo.startsAt || now > promo.expiresAt) {
      throw new BadRequestException('Promotion has expired');
    }
    if (promo.usageLimit > 0 && promo.usageCount >= promo.usageLimit) {
      throw new BadRequestException('Promotion usage limit reached');
    }
    if (orderTotal < promo.minOrder) {
      throw new BadRequestException(`Minimum order of ₹${promo.minOrder} required`);
    }

    let discount = promo.type === 'PERCENTAGE'
      ? (orderTotal * promo.value) / 100
      : promo.value;

    if (promo.maxDiscount && discount > promo.maxDiscount) {
      discount = promo.maxDiscount;
    }

    return { valid: true, discount: parseFloat(discount.toFixed(2)), promotion: promo };
  }

  async incrementUsage(code: string) {
    const promo = await this.promotionRepository.findOne({ where: { code } });
    if (promo) {
      promo.usageCount += 1;
      await this.promotionRepository.save(promo);
    }
  }

  async update(id: string, data: Partial<Promotion>) {
    const promo = await this.promotionRepository.findOne({ where: { id } });
    if (!promo) throw new NotFoundException('Promotion not found');
    Object.assign(promo, data);
    return this.promotionRepository.save(promo);
  }

  async delete(id: string) {
    const result = await this.promotionRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Promotion not found');
    return { deleted: true };
  }
}
