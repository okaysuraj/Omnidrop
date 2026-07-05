import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../../database/entities';
import { CreateStoreDto, UpdateStoreDto, NearbyStoresQueryDto } from './dto/store.dto';

@Injectable()
export class StoresService {
  private readonly logger = new Logger(StoresService.name);

  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(ownerId: string, dto: CreateStoreDto) {
    const store = this.storeRepository.create({
      ...dto,
      ownerId,
      isVerified: false,
    });

    await this.storeRepository.save(store);
    this.logger.log(`Store created: ${store.name} by owner ${ownerId}`);
    return store;
  }

  async findNearby(query: NearbyStoresQueryDto) {
    const { lat, lng, radius = 10 } = query;

    // Haversine formula in SQL for distance calculation
    const stores = await this.storeRepository
      .createQueryBuilder('store')
      .addSelect(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(store.lat)) * cos(radians(store.lng) - radians(:lng)) + sin(radians(:lat)) * sin(radians(store.lat))))`,
        'distance',
      )
      .where('store.is_active = :isActive', { isActive: true })
      .andWhere('store.is_verified = :isVerified', { isVerified: true })
      .having(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(store.lat)) * cos(radians(store.lng) - radians(:lng)) + sin(radians(:lat)) * sin(radians(store.lat)))) < :radius`,
      )
      .setParameters({ lat, lng, radius })
      .orderBy('distance', 'ASC')
      .groupBy('store.id')
      .getRawAndEntities();

    return stores.entities.map((store, index) => ({
      ...store,
      distance: parseFloat(stores.raw[index]?.distance || '0'),
      estimatedDeliveryMinutes: Math.max(10, Math.round(parseFloat(stores.raw[index]?.distance || '0') * 6)),
      isOpen: this.isStoreOpen(store),
    }));
  }

  async findById(id: string) {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return {
      ...store,
      isOpen: this.isStoreOpen(store),
    };
  }

  async findByOwner(ownerId: string) {
    return this.storeRepository.find({
      where: { ownerId },
    });
  }

  async update(id: string, ownerId: string, dto: UpdateStoreDto) {
    const store = await this.storeRepository.findOne({ where: { id } });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.ownerId !== ownerId) {
      throw new ForbiddenException('You can only update your own store');
    }

    Object.assign(store, dto);
    await this.storeRepository.save(store);

    return store;
  }

  async verifyStore(id: string) {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');

    store.isVerified = true;
    await this.storeRepository.save(store);
    return store;
  }

  async findAll(page = 1, pageSize = 20) {
    const [items, total] = await this.storeRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  private isStoreOpen(store: Store): boolean {
    if (!store.businessHours) return true;

    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[now.getDay()];
    const hours = store.businessHours[today];

    if (!hours || hours.isClosed) return false;

    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime >= hours.open && currentTime <= hours.close;
  }
}
