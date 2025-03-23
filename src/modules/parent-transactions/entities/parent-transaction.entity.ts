import { Transaction } from "src/modules/transactions/entities/transaction.entity";
import { User } from "src/modules/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ schema: 'finance', name: 'parent_transactions' })
export class ParentTransaction {

  @PrimaryGeneratedColumn()
  parent_transaction_id: number;

  @ManyToOne(() => User, (user) => user.user_id)
  @JoinColumn()
  parent_id: string;

  @OneToOne(() => Transaction, (transaction) => transaction.transaction_id)
  @JoinColumn()
  @Column()
  transaction_id: string;
}