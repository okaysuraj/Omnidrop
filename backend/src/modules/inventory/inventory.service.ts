import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../common/enums';
import { Inventory, Store, User } from '../../database/entities';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async verifyStoreAccess(storeId: string, user: User) {
    if (user.role === UserRole.ADMIN) return;
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Store not found');
    if (store.ownerId !== user.id) {
      throw new ForbiddenException('You do not have permission to manage this store');
    }
  }

  async findByStore(storeId: string, user?: User, page = 1, pageSize = 50) {
    if (user) {
      await this.verifyStoreAccess(storeId, user);
    }
    const [items, total] = await this.inventoryRepository.findAndCount({
      where: { storeId },
      relations: { product: { category: true } },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { product: { name: 'ASC' } },
    });

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findVisibleByStore(storeId: string, categoryId?: string) {
    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .where('inventory.store_id = :storeId', { storeId })
      .andWhere('inventory.is_visible = :isVisible', { isVisible: true })
      .andWhere('inventory.stock > 0');

    if (categoryId) {
      query.andWhere('product.category_id = :categoryId', { categoryId });
    }

    return query.orderBy('product.name', 'ASC').getMany();
  }

  async upsert(
    storeId: string,
    productId: string,
    data: { stock: number; priceOverride?: number; isVisible?: boolean },
    user?: User,
  ) {
    if (user) {
      await this.verifyStoreAccess(storeId, user);
    }

    let item = await this.inventoryRepository.findOne({
      where: { storeId, productId },
    });

    if (item) {
      Object.assign(item, data);
    } else {
      item = this.inventoryRepository.create({
        storeId,
        productId,
        ...data,
      });
    }

    return this.inventoryRepository.save(item);
  }

  async bulkUpsert(
    storeId: string,
    items: Array<{ productId: string; stock: number; priceOverride?: number; isVisible?: boolean }>,
    user?: User,
  ) {
    if (user) {
      await this.verifyStoreAccess(storeId, user);
    }

    const results = [];
    for (const item of items) {
      results.push(await this.upsert(storeId, item.productId, item, user));
    }
    return results;
  }

  async updateStock(storeId: string, productId: string, stock: number, user?: User) {
    if (user) {
      await this.verifyStoreAccess(storeId, user);
    }

    const item = await this.inventoryRepository.findOne({
      where: { storeId, productId },
    });
    if (!item) throw new NotFoundException('Inventory item not found');

    item.stock = stock;
    return this.inventoryRepository.save(item);
  }

  async toggleVisibility(storeId: string, productId: string, user?: User) {
    if (user) {
      await this.verifyStoreAccess(storeId, user);
    }

    const item = await this.inventoryRepository.findOne({
      where: { storeId, productId },
    });
    if (!item) throw new NotFoundException('Inventory item not found');

    item.isVisible = !item.isVisible;
    return this.inventoryRepository.save(item);
  }
}
