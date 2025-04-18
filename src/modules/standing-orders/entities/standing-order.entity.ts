import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

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

  @Column()
  status: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
