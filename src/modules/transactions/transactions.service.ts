import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionType, TransactionStatus } from './entities/transaction.entity';
import { Task } from '../tasks/task.entity'; 
import { SavingsGoal } from '../savings-goals/entities/savings-goal.entity';
import { SavingsGoalsTransaction } from '../savings-goals/entities/savings-goals-transaction.entity';
import { User } from '../users/user.entity';


@Injectable()
export class TransactionsService {
 constructor(
  @InjectRepository(ChildBalance)
  private childBalanceRepository: Repository<ChildBalance>,

  @InjectRepository(Transaction)
  private transactionsRepository: Repository<Transaction>,

  @InjectRepository(User)
  private usersRepository: Repository<User>,


  @InjectRepository(Task)
  private tasksRepository: Repository<Task>,

  @InjectRepository(SavingsGoal)
  private goalsRepository: Repository<SavingsGoal>,

  @InjectRepository(SavingsGoalsTransaction)
  private goalTransactionsRepository: Repository<SavingsGoalsTransaction>,
) {}

  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }


  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }


  async createTaskPaymentRequest(taskId: string, childId: string) {
    const childBalance = await this.childBalanceRepository.findOne({
      where: { child_id: childId },
    });

    if (!childBalance) {
      throw new Error('לא נמצאה יתרה לילד');
    }

    const task = await this.tasksRepository.findOne({ where: { task_id: taskId } });
    if (!task) {
      throw new Error('מטלה לא נמצאה');
    }

    const transaction = this.transactionsRepository.create({
      balance_id: childBalance.balance_id,
      child_balance: childBalance,
      type: TransactionType.PARENT_DEPOSIT,
      amount: task.payment_amount,
      description: task.name,
      status: TransactionStatus.PENDING_PARENT_APPROVAL,
    });

    return this.transactionsRepository.save(transaction);
  }

  async createGoalDepositTransaction(
    balanceId: number,
    goalId: number,
    amount: number,
    description: string = 'הפקדה לחיסכון'
  ): Promise<Transaction> {
    const balance = await this.childBalanceRepository.findOne({ where: { balance_id: balanceId } });
    const goal = await this.goalsRepository.findOne({ where: { id: goalId } });

    if (!balance || !goal) {
      throw new Error('Balance או Goal לא נמצאו');
    }

    if (amount > balance.balance_amount) {
      throw new BadRequestException('סכום ההפקדה גבוה מיתרת הילד');
    }

    const transaction = this.transactionsRepository.create({
      balance_id: balance.balance_id,
      child_balance: balance,
      type: TransactionType.GOAL_DEPOSIT,
      amount,
      description,
      status: TransactionStatus.COMPLETED,
    });

    const savedTransaction = await this.transactionsRepository.save(transaction);

    const goalTransaction = this.goalTransactionsRepository.create({
      goal_id: goal.id,
      transaction_id: savedTransaction.transaction_id,
    });

    await this.goalTransactionsRepository.save(goalTransaction);

    const roundedAmount = Math.floor(amount); 

    balance.balance_amount -= roundedAmount;
    goal.current_amount = Math.floor(Number(goal.current_amount) + roundedAmount);

    console.log('updated goal.current_amount:', goal.current_amount);

    await this.childBalanceRepository.save(balance);
    await this.goalsRepository.save(goal);

    return savedTransaction;
  }

   async handleStorePurchaseApproval(
      parentId: string,
      transactionId: string,
      action: 'approve' | 'reject'
    ) {
      const tx = await this.transactionsRepository.findOne({
        where: { transaction_id: transactionId },
        relations: ['child_balance', 'child_balance.child_user', 'child_balance.child_user.family']
      });
  
      if (!tx) {
        throw new Error('Transaction not found');
      }
  
      const child = tx.child_balance.child_user;
      const parent = await this.usersRepository.findOne({ where: { user_id: parentId }, relations: ['family'] });
  
      if (!parent || !parent.family || !child || child.family.id !== parent.family.id) {
        throw new Error('Parent and child mismatch');
      }
  
      tx.status =
        action === 'approve'
          ? TransactionStatus.APPROVED_BY_PARENT
          : TransactionStatus.REJECTED;
  
      await this.transactionsRepository.save(tx);
  
      return { message: `Store purchase ${action}d successfully.` };
    }
  
    async handleDepositApproval(
      parentId: string,
      transactionId: string,
      action: 'approve' | 'reject'
    ) {
      const tx = await this.transactionsRepository.findOne({
        where: { transaction_id: transactionId },
        relations: ['child_balance', 'child_balance.child_user', 'child_balance.child_user.family']
      });
  
      if (!tx) {
        throw new Error('Transaction not found');
      }
  
      const child = tx.child_balance.child_user;
      const parent = await this.usersRepository.findOne({ where: { user_id: parentId }, relations: ['family'] });
  
      if (!parent || !parent.family || !child || child.family.id !== parent.family.id) {
        throw new Error('Parent and child mismatch');
      }
  
      if (action === 'approve') {
        tx.child_balance.balance_amount += tx.amount;
        await this.childBalanceRepository.save(tx.child_balance);
        tx.status = TransactionStatus.COMPLETED; 
      } else {
        tx.status = TransactionStatus.REJECTED;
      }
  
      await this.transactionsRepository.save(tx);
  
      return { message: `Deposit request ${action}d successfully.` };
    }


}
