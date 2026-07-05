import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem, Inventory } from '../../database/entities';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async getCart(userId: string) {
    const items = await this.cartItemRepository.find({
      where: { userId },
    });

    if (items.length === 0) {
      return { items: [], storeId: null, subtotal: 0, deliveryFee: 0, discount: 0, total: 0 };
    }

    const storeId = items[0].storeId;

    // Get inventory details for each cart item
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const inventory = await this.inventoryRepository.findOne({
          where: { storeId: item.storeId, productId: item.productId },
          relations: { product: { category: true } },
        });
        return {
          ...item,
          product: inventory?.product,
          inventory,
          effectivePrice: inventory?.priceOverride || inventory?.product?.sellingPrice || 0,
        };
      }),
    );

    const subtotal = enrichedItems.reduce((sum, item) => sum + item.effectivePrice * item.quantity, 0);
    const deliveryFee = subtotal > 500 ? 0 : 30; // Free delivery over 500

    return {
      items: enrichedItems,
      storeId,
      subtotal: parseFloat(subtotal.toFixed(2)),
      deliveryFee,
      discount: 0,
      total: parseFloat((subtotal + deliveryFee).toFixed(2)),
    };
  }

  async addItem(userId: string, storeId: string, productId: string, quantity: number) {
    // Check if user has items from a different store
    const existingItems = await this.cartItemRepository.find({ where: { userId } });

    if (existingItems.length > 0 && existingItems[0].storeId !== storeId) {
      throw new BadRequestException(
        'Cart contains items from another store. Clear cart first.',
      );
    }

    // Check inventory
    const inventory = await this.inventoryRepository.findOne({
      where: { storeId, productId, isVisible: true },
    });

    if (!inventory || inventory.stock < quantity) {
      throw new BadRequestException('Product not available or insufficient stock');
    }

    // Upsert cart item
    let cartItem = await this.cartItemRepository.findOne({
      where: { userId, storeId, productId },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({ userId, storeId, productId, quantity });
    }

    await this.cartItemRepository.save(cartItem);
    return this.getCart(userId);
  }

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, userId },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    if (quantity <= 0) {
      await this.cartItemRepository.remove(cartItem);
    } else {
      cartItem.quantity = quantity;
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, userId },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.cartItemRepository.remove(cartItem);
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    await this.cartItemRepository.delete({ userId });
    return { items: [], storeId: null, subtotal: 0, deliveryFee: 0, discount: 0, total: 0 };
  }
}
