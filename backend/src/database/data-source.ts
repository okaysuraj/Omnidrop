import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
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
} from './entities';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://omnidrop:omnidrop_secret@localhost:5432/omnidrop',
  entities: [
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
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});
