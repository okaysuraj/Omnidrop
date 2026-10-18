import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

// Common
import { FirebaseAuthGuard } from './common/guards/firebase-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

// Database entities
import {
  Address,
  CartItem,
  Category,
  DeliveryTask,
  Inventory,
  Order,
  OrderItem,
  Payment,
  Product,
  Promotion,
  Review,
  Store,
  SupportTicket,
  User,
  Wallet,
  WalletTransaction,
} from './database/entities';

// Modules
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductsModule } from './modules/products/products.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { StoresModule } from './modules/stores/stores.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { WsModule } from './websockets/ws.module';

const entities = [
  User,
  Address,
  Store,
  Category,
  Product,
  Inventory,
  CartItem,
  Order,
  OrderItem,
  Payment,
  DeliveryTask,
  Review,
  Promotion,
  Wallet,
  WalletTransaction,
  SupportTicket,
];

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get(
          'DATABASE_URL',
          'postgresql://omnidrop:omnidrop_secret@localhost:5432/omnidrop',
        ),
        entities,
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
        ssl: config.get('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),

    // Global entity registration for guards
    TypeOrmModule.forFeature([User]),

    // Feature modules
    AuthModule,
    UsersModule,
    StoresModule,
    ProductsModule,
    InventoryModule,
    CartModule,
    OrdersModule,
    DeliveryModule,
    ReviewsModule,
    PromotionsModule,
    AdminModule,
    NotificationsModule,
    PaymentsModule,
    WalletModule,
    WsModule,
  ],
  providers: [
    // Global guards - Firebase auth + RBAC
    { provide: APP_GUARD, useClass: FirebaseAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
