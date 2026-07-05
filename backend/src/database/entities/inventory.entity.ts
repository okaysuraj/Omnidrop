import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Store } from './store.entity';
import { Product } from './product.entity';

@Entity('inventory')
@Unique('uq_store_product', ['storeId', 'productId'])
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'store_id' })
  storeId: string;

  @Index()
  @Column({ name: 'product_id' })
  productId: string;

  @Column({ default: 0 })
  stock: number;

  @Column({ name: 'price_override', type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceOverride: number;

  @Column({ name: 'is_visible', default: true })
  isVisible: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Store, (store) => store.inventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => Product, (product) => product.inventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
