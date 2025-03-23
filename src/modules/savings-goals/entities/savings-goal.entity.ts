import { ChildBalance } from "src/modules/child-balance/entities/child-balance.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne } from "typeorm";

export enum GoalStatus{
    ACTIVE = 'active',
    COMPLETED = 'completed',
    CANCELED = 'canceled'
}

@Entity({ schema: 'finance', name: 'savings_goals' })
export class SavingsGoal {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  target_amount: number;

  @Column({default: 0})
  current_amount: number;

  @CreateDateColumn()
  start_date: Date;

  @Column()
  due_date: Date;

  @Column({
        type: 'enum',
        enum: GoalStatus,
        default: GoalStatus.ACTIVE
  })
  status: GoalStatus;

  @CreateDateColumn()
   created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => ChildBalance, (childBalance) => childBalance.balance_id)
  @JoinColumn()
  balance_id: string;
}