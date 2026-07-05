import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Inventory } from './inventory.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'owner_id' })
  ownerId: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ type: 'text' })
  address: string;

  @Index()
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  lat: number;

  @Index()
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  lng: number;

  @Column({ name: 'radius_km', type: 'decimal', precision: 5, scale: 2, default: 5 })
  radiusKm: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ name: 'total_ratings', default: 0 })
  totalRatings: number;

  @Column({ name: 'business_hours', type: 'jsonb', nullable: true })
  businessHours: Record<string, { open: string; close: string; isClosed: boolean }>;

  @Column({ nullable: true })
  phone: string;

  // KYC
  @Column({ name: 'kyc_document_url', nullable: true })
  kycDocumentUrl: string;

  @Column({ name: 'bank_account_number', nullable: true })
  bankAccountNumber: string;

  @Column({ name: 'bank_ifsc', nullable: true })
  bankIfsc: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.stores)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => Inventory, (inventory) => inventory.store)
  inventory: Inventory[];

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.store)
  reviews: Review[];
}
