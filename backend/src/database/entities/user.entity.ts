import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { UserRole } from '../../common/enums';
import { Address } from './address.entity';
import { CartItem } from './cart-item.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { DeliveryTask } from './delivery-task.entity';
import { Store } from './store.entity';
import { Wallet } from './wallet.entity';
import { SupportTicket } from './support-ticket.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'firebase_uid', unique: true })
  firebaseUid: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Delivery partner fields
  @Column({ name: 'vehicle_type', nullable: true })
  vehicleType: string;

  @Column({ name: 'vehicle_number', nullable: true })
  vehicleNumber: string;

  @Column({ name: 'is_available', default: false })
  isAvailable: boolean;

  @Column({ name: 'current_lat', type: 'decimal', precision: 10, scale: 6, nullable: true })
  currentLat: number;

  @Column({ name: 'current_lng', type: 'decimal', precision: 10, scale: 6, nullable: true })
  currentLng: number;

  @Column({ type: 'varchar', nullable: true, name: 'fcm_token' })
  fcmToken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // Relations
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => DeliveryTask, (task) => task.rider)
  deliveryTasks: DeliveryTask[];

  @OneToMany(() => Store, (store) => store.owner)
  stores: Store[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => SupportTicket, (ticket) => ticket.user)
  supportTickets: SupportTicket[];
}
