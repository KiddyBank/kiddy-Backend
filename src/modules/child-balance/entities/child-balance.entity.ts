import { SavingsGoal } from "src/modules/savings-goals/entities/savings-goal.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";

@Entity({ schema: 'finance', name: 'child_balance' })
export class ChildBalance {
  @PrimaryGeneratedColumn('uuid')
  balance_id: string;

  @Column()
  child_id: string;

  @Column()
  balance_amount: string;

  @Column()
  last_updated: string;

  @Column()
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  user: Date;

  @OneToMany(() => SavingsGoal, (SavingGoal) => SavingGoal., { cascade: true })
  @JoinColumn({ name: 'name' })
  savings_goals: Date;

  @Column({ nullable: true })
  standing_orders: number;

  @Column({ nullable: true })
  balance_id_tasks_balance_id: string;

  @Column({ nullable: true })
  transactions: string;
}