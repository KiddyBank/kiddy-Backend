import { ChildBalance } from "src/modules/child-balance/entities/child-balance.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TransactionType{
    PARENT_CHARGE = 'parent_charge',
    PARENT_DEPOSIT = 'parent_deposit',
    GOAL_DEPOSIT = 'goal_deposit',
    GOAL_WITHDRAW = 'goal_withdraw',
    REQUEST_FOR_PAYMENT = 'request_for_payment',
    STORE_PURCHASE = 'store_purchase',
    STORE_REFUND = 'store_refund'
}

export enum TransactionStatus{
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REJECTED = 'REJECTED',
    APPROVED = 'APPORVED',
    PENDING_STORE = 'PENDING_STORE'
}

@Entity({ schema: 'finance', name: 'transactions' })
export class Transaction {

constructor(childId: number, transactionType: TransactionType, amount: number, description: string) {
        this.balance_id = childId;
        this.type=transactionType;
        this.amount=amount;
        this.description = description;
        this.status = TransactionStatus.PENDING;
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
    enum: TransactionStatus,
    default: TransactionStatus.PENDING
})
  status: TransactionStatus;

  @CreateDateColumn()
  created_at:  boolean;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

}