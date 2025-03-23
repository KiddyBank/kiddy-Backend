import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export enum SubscriptionFrequency{
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    YEARLY = 'yearly'
}

@Entity({ schema: 'finance', name: 'subscriptions' })
export class Subscription {

  @PrimaryGeneratedColumn()
  subscription_id: number;

  @Column()
  plan_name: string;

  @Column()
  amount: number;

  @Column()
  description: string;


  @CreateDateColumn()
  start_date: Date;

  @CreateDateColumn()
   created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({
        type: 'enum',
        enum: SubscriptionFrequency,
        default: SubscriptionFrequency.MONTHLY
    })
  frequency: SubscriptionFrequency;
}