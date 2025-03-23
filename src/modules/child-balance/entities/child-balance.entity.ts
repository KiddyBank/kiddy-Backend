import { User } from "src/modules/users/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, OneToOne, JoinColumn  } from "typeorm";

@Entity({ schema: 'finance', name: 'child_balance' })
export class ChildBalance {

  @PrimaryGeneratedColumn()
  balance_id: number;

  @Column()
  @OneToOne(() => User, (user) => user.user_id)
  @JoinColumn({ name: 'child_id' })
  child_id: string;

  @Column({type: 'double precision', default: 0})
  balance_amount: number;

  @UpdateDateColumn()
  last_updated: Date;

  @Column({default: true})
  is_active: boolean;
  
}