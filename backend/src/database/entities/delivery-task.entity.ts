import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { DeliveryStatus } from '../../common/enums';
import { Order } from './order.entity';
import { User } from './user.entity';

@Entity('delivery_tasks')
export class DeliveryTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', unique: true })
  orderId: string;

  @Index()
  @Column({ name: 'rider_id', nullable: true })
  riderId: string;

  @Column({ type: 'enum', enum: DeliveryStatus, default: DeliveryStatus.PENDING })
  status: DeliveryStatus;

  @Column({ name: 'pickup_lat', type: 'decimal', precision: 10, scale: 6 })
  pickupLat: number;

  @Column({ name: 'pickup_lng', type: 'decimal', precision: 10, scale: 6 })
  pickupLng: number;

  @Column({ name: 'drop_lat', type: 'decimal', precision: 10, scale: 6 })
  dropLat: number;

  @Column({ name: 'drop_lng', type: 'decimal', precision: 10, scale: 6 })
  dropLng: number;

  @Column({ name: 'current_lat', type: 'decimal', precision: 10, scale: 6, nullable: true })
  currentLat: number;

  @Column({ name: 'current_lng', type: 'decimal', precision: 10, scale: 6, nullable: true })
  currentLng: number;

  @Column({ name: 'eta_minutes', nullable: true })
  etaMinutes: number;

  @Column({ name: 'picked_up_at', nullable: true })
  pickedUpAt: Date;

  @Column({ name: 'delivered_at', nullable: true })
  deliveredAt: Date;

  @Column({ name: 'cod_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  codAmount: number;

  @Column({ name: 'cod_collected', default: false })
  codCollected: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => Order, (order) => order.deliveryTask, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User, (user) => user.deliveryTasks)
  @JoinColumn({ name: 'rider_id' })
  rider: User;
}
