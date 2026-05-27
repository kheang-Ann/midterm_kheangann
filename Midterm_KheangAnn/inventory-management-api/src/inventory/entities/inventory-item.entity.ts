import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Supplier } from '../../suppliers/entities/supplier.entity';

export enum ItemStatus {
  AVAILABLE = 'available',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  sku: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 10 })
  lowStockThreshold: number;

  @Column({
    type: 'text',
    default: ItemStatus.AVAILABLE,
  })
  status: ItemStatus;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  supplierId: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.inventoryItems, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
