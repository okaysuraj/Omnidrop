import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  DeliveryStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  WalletTransactionType,
} from '../../common/enums';
import { getErrorMessage } from '../../common/errors';
import {
  Address,
  CartItem,
  DeliveryTask,
  Inventory,
  Order,
  OrderItem,
  Payment,
  Store,
  User,
  Wallet,
  WalletTransaction,
} from '../../database/entities';
import { WsGateway } from '../../websockets/ws.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { PromotionsService } from '../promotions/promotions.service';

export interface CheckoutInput {
  deliveryAddress?: string;
  deliveryAddressId?: string;
  deliveryLat?: number;
  deliveryLng?: number;
  deliveryInstructions?: string;
  paymentMethod: PaymentMethod | string;
  tip?: number;
  promotionCode?: string;
}

// Creates an order and its stock, wallet, payment and delivery records atomically.
@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);
  constructor(
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private wsGateway: WsGateway,
    private notificationsService: NotificationsService,
    private promotionsService: PromotionsService,
    private dataSource: DataSource,
  ) {}

  async checkout(userId: string, data: CheckoutInput) {
    const { deliveryAddress, deliveryLat, deliveryLng } = await this.resolveAddress(userId, data);
    const paymentMethod = this.resolvePaymentMethod(data.paymentMethod);

    // Get cart items
    const cartItems = await this.cartItemRepository.find({ where: { userId } });
    if (cartItems.length === 0) throw new BadRequestException('Cart is empty');

    const storeId = cartItems[0].storeId;
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) throw new BadRequestException('Store not found');

    // Use a transaction for atomicity
    const result = await this.dataSource.transaction(async (manager) => {
      const { subtotal, orderItems } = await this.reserveStock(manager, cartItems);

      const deliveryFee = subtotal > 500 ? 0 : 30;
      const tip = data.tip || 0;
      let discount = 0;
      if (data.promotionCode) {
        try {
          const promoRes = await this.promotionsService.validate(data.promotionCode, subtotal);
          if (promoRes && promoRes.valid) {
            discount = promoRes.discount || 0;
            await this.promotionsService.incrementUsage(data.promotionCode);
          }
        } catch (err) {
          this.logger.warn(
            `Promotion code ${data.promotionCode} could not be applied: ${getErrorMessage(err)}`,
          );
        }
      }
      const total = Math.max(0, parseFloat((subtotal + deliveryFee + tip - discount).toFixed(2)));

      if (paymentMethod === PaymentMethod.WALLET) {
        await this.debitWallet(manager, userId, total);
      }

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
        deliveryAddress,
        deliveryLat,
        deliveryLng,
        deliveryInstructions: data.deliveryInstructions,
        paymentMethod,
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
      const paymentStatus =
        paymentMethod === PaymentMethod.WALLET ? PaymentStatus.COMPLETED : PaymentStatus.PENDING;
      const payment = manager.create(Payment, {
        orderId: savedOrder.id,
        amount: total,
        status: paymentStatus,
        method: paymentMethod,
      });
      await manager.save(payment);

      // Create delivery task
      const deliveryTask = manager.create(DeliveryTask, {
        orderId: savedOrder.id,
        status: DeliveryStatus.PENDING,
        pickupLat: store.lat,
        pickupLng: store.lng,
        dropLat: deliveryLat,
        dropLng: deliveryLng,
        codAmount: paymentMethod === PaymentMethod.COD ? total : 0,
      });
      await manager.save(deliveryTask);

      // Clear cart
      await manager.delete(CartItem, { userId });

      return {
        ...savedOrder,
        items: orderItems,
        payment,
        deliveryTask,
      };
    });

    // Notify store
    this.wsGateway.emitNewOrder(storeId, result);

    const owner = await this.userRepository.findOne({ where: { id: store.ownerId } });
    if (owner?.fcmToken) {
      void this.notificationsService.sendPushNotification(
        owner.fcmToken,
        'New Order Received! 📦',
        `Order #${result.id.slice(-6)} for ₹${result.total} from ${store.name}`,
        { orderId: result.id, type: 'NEW_ORDER' },
      );
    }

    return result;
  }

  private async resolveAddress(userId: string, data: CheckoutInput) {
    let deliveryAddress = data.deliveryAddress || '';
    let deliveryLat = data.deliveryLat || 12.9716;
    let deliveryLng = data.deliveryLng || 77.5946;

    if (data.deliveryAddressId) {
      const address = await this.dataSource.getRepository(Address).findOne({
        where: { id: data.deliveryAddressId, userId },
      });
      if (address) {
        deliveryAddress = `${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}, ${address.city} - ${address.pincode}`;
        if (address.lat) deliveryLat = Number(address.lat);
        if (address.lng) deliveryLng = Number(address.lng);
      }
    }

    if (!deliveryAddress) {
      deliveryAddress = 'Current Location, Bengaluru';
    }

    return { deliveryAddress, deliveryLat, deliveryLng };
  }

  private resolvePaymentMethod(value: string): PaymentMethod {
    let paymentMethod: PaymentMethod = PaymentMethod.ONLINE;
    const pmUpper = (value || '').toString().toUpperCase();
    if (pmUpper === 'COD' || pmUpper === 'CASH') {
      paymentMethod = PaymentMethod.COD;
    } else if (pmUpper === 'WALLET') {
      paymentMethod = PaymentMethod.WALLET;
    } else if (pmUpper === 'UPI') {
      paymentMethod = PaymentMethod.UPI;
    } else {
      paymentMethod = PaymentMethod.ONLINE;
    }

    return paymentMethod;
  }

  // Lock stock rows until the checkout transaction commits or rolls back.
  private async reserveStock(manager: EntityManager, cartItems: CartItem[]) {
    let subtotal = 0;
    const orderItems: Partial<OrderItem>[] = [];

    // Validate stock and build order items with pessimistic write lock
    for (const cartItem of cartItems) {
      const inventory = await manager.findOne(Inventory, {
        where: { storeId: cartItem.storeId, productId: cartItem.productId },
        relations: { product: true },
        lock: { mode: 'pessimistic_write' },
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

    return { subtotal, orderItems };
  }

  private async debitWallet(manager: EntityManager, userId: string, total: number) {
    const wallet = await manager.findOne(Wallet, {
      where: { userId },
      lock: { mode: 'pessimistic_write' },
    });
    const balance = wallet ? parseFloat(Number(wallet.balance).toString()) : 0;
    if (!wallet || balance < total) {
      throw new BadRequestException(
        `Insufficient wallet balance. Balance: ₹${balance.toFixed(2)}, Order Total: ₹${total.toFixed(2)}`,
      );
    }
    wallet.balance = parseFloat((balance - total).toFixed(2));
    await manager.save(wallet);

    const walletTx = manager.create(WalletTransaction, {
      walletId: wallet.id,
      amount: total,
      type: WalletTransactionType.DEBIT,
      referenceId: `order_${Date.now()}`,
      description: `Paid for Order`,
    });
    await manager.save(walletTx);
  }
}
