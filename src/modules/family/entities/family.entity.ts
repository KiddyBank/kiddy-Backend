import { Subscription } from "src/modules/subscriptions/entities/subscription.entity";
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, OneToOne, JoinColumn  } from "typeorm";

@Entity({ schema: 'finance', name: 'family' })
export class Family {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Subscription, (subscription) => subscription.subscription_id)
  @JoinColumn({ name: 'subscription_plan_id' })
  subscription: Subscription;

@Column()
  subscription_plan_id: number;

  @Column()
  subscription_start_date: Date;

  @Column()
  subscription_end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}