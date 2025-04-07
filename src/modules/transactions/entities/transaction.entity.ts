import { ChildBalance } from "src/modules/child-balance/entities/child-balance.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TransactionType{
    PARENT_CHARGE = 'parent_charge',
    PARENT_DEPOSIT = 'parent_deposit',
    GOAL_DEPOSIT = 'goal_deposit',
    GOAL_WITHDRAW = 'goal_withdraw',
    STORE_PURCHASE = 'store_purchase',
    STORE_REFUND = 'store_refund'
}

export enum TransactionStatus{
    PENDING_PARENT_APPROVAL = 'PENDING_PARENT_APPROVAL',
    APPORVED_BY_PARENT = 'APPROVED_BY_PARENT',
    PENDING_STORE = 'PENDING_STORE',
    FAILED = 'FAILED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
}

@Entity({ schema: 'finance', name: 'transactions' })
export class Transaction {

constructor(balanceId: number, transactionType: TransactionType, amount: number, description: string, status: TransactionStatus) {
        this.balance_id = balanceId
        this.type=transactionType;
        this.amount=amount;
        this.description = description;
        this.status = status;
          }

  @PrimaryGeneratedColumn('uuid')
  transaction_id: string;

  @Column({
        type: 'enum',
        enum: TransactionType
  })
  type: TransactionType;

  @ManyToOne(() => ChildBalance, (childBalance) => childBalance.balance_id)
  @JoinColumn({name: 'balance_id'})
  balance_id: number;

  @Column({type: 'double precision', default: 0})
  amount: number;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus
})
  status: TransactionStatus;

  @CreateDateColumn()
  created_at:  boolean;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

}