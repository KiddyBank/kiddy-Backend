import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'finance', name: 'child_balance' })
export class Balance {
  @PrimaryGeneratedColumn()
  balance_id: number;

  @Column()
  child_id: string;

  @Column({ type: 'double precision', default: 0 })
  balance_amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_updated: Date;

  @Column({ default: true })
  is_active: boolean;
}
