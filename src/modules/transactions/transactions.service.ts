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




@Injectable()
export class TransactionsService {
 constructor(
  @InjectRepository(ChildBalance)
  private childBalanceRepository: Repository<ChildBalance>,

  @InjectRepository(Transaction)
  private transactionsRepository: Repository<Transaction>,

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

  // עדכון יתרה ועדכון סכום נוכחי ביעד
  balance.balance_amount -= amount;
  goal.current_amount += amount;

  await this.childBalanceRepository.save(balance);
  await this.goalsRepository.save(goal);

  return savedTransaction;
}


}
