// standing-order.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

export type StandingOrderStatus = 'active' | 'paused' | 'complete';

@Entity('standing_orders', { schema: 'finance' })
export class StandingOrder {
  @PrimaryGeneratedColumn({ name: 'deposit_id' })
  id: number;

  @Column({ name: 'balance_id' })
  balanceId: number;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({ name: 'days_frequency' })
  daysFrequency: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'finish_date', type: 'date', nullable: true })
  finishDate: Date | null;

  @Column({ type: 'varchar' })
  status: StandingOrderStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
