import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';
import { Store } from './store.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'order_id', unique: true })
  orderId: string;

  @Column({ name: 'store_id', nullable: true })
  storeId: string;

  @Column({ name: 'rider_id', nullable: true })
  riderId: string;

  @Column({ name: 'store_rating', nullable: true })
  storeRating: number;

  @Column({ name: 'rider_rating', nullable: true })
  riderRating: number;

  @Column({ nullable: true, type: 'text' })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Order, (order) => order.review)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Store, (store) => store.reviews)
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
