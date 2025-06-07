import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionType, TransactionStatus } from './entities/transaction.entity';
import { Task } from '../tasks/task.entity'; 



@Injectable()
export class TransactionsService {
 constructor(
  @InjectRepository(ChildBalance)
  private childBalanceRepository: Repository<ChildBalance>,

  @InjectRepository(Transaction)
  private transactionsRepository: Repository<Transaction>,

  @InjectRepository(Task)
  private tasksRepository: Repository<Task>,
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


}
