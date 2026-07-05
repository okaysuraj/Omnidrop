import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { APP_GUARD } from '@nestjs/core';

// Common
import { FirebaseAuthGuard } from './common/guards/firebase-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

// Database entities
import {
  User, Address, Store, Category, Product, Inventory,
  CartItem, Order, OrderItem, Payment, DeliveryTask,
  Review, Promotion, Wallet, WalletTransaction, SupportTicket,
} from './database/entities';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StoresModule } from './modules/stores/stores.module';
import { ProductsModule } from './modules/products/products.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AdminModule } from './modules/admin/admin.module';
import { WsModule } from './websockets/ws.module';

const entities = [
  User, Address, Store, Category, Product, Inventory,
  CartItem, Order, OrderItem, Payment, DeliveryTask,
  Review, Promotion, Wallet, WalletTransaction, SupportTicket,
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
        url: config.get('DATABASE_URL', 'postgresql://omnidrop:omnidrop_secret@localhost:5432/omnidrop'),
        entities,
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
        ssl: config.get('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),

    // Redis/BullMQ
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        connection: {
          url: config.get('REDIS_URL', 'redis://localhost:6379'),
        },
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
    WsModule,
  ],
  providers: [
    // Global guards - Firebase auth + RBAC
    { provide: APP_GUARD, useClass: FirebaseAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
