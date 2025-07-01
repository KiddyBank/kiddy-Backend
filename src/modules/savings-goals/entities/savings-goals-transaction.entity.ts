import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SavingsGoal } from './savings-goal.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';

@Entity({ schema: 'finance', name: 'savings_goals_transactions' })
export class SavingsGoalsTransaction {
  @PrimaryGeneratedColumn()
  goal_transaction_id: number;

  @ManyToOne(() => SavingsGoal)
  @JoinColumn({ name: 'goal_id' })
  goal: SavingsGoal;

  @Column()
  goal_id: number;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column()
  transaction_id: string; 
}
