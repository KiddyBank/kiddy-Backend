import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';
import { Transaction } from '../transactions/entities/transaction.entity'; 
import { Task } from '../tasks/entities/task.entity'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(ChildBalance)
    private balanceRepository: Repository<ChildBalance>,

    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>, 

    @InjectRepository(Task)
    private tasksRepository: Repository<Task>, 
  ) {}

  async getBalance(userId: string) {
    try {
      const balance = await this.balanceRepository.findOne({
        where: { child_id: userId },
      });

      if (!balance) {
        return { balance: 0, message: 'Balance not found' };
      }

      return { balance: balance.balance_amount };
    } catch (error) {
      throw error;
    }
  }

  async getFixedTransactions(balanceId: number) {
    try {
      const transactions = await this.transactionsRepository.find({
        where: { balance_id: balanceId },
        order: { created_at: 'DESC' },
      });

      return transactions;
    } catch (error) {
      throw error;
    }
  }

  async getFixedTasks(balanceId: number) {
    try {
      const tasks = await this.tasksRepository.find({
        where: { balance_id: balanceId },
      });
  
      return tasks;
    } catch (error) {
      console.error('❌ Error fetching tasks:', error);
      return []; 
    }
  }
  

  async deductBalance(userId: string, amount: number) {
    try {
      const balance = await this.balanceRepository.findOne({
        where: { child_id: userId },
      });
  
      if (!balance) {
        return { success: false, message: 'Balance not found' };
      }

      balance.balance_amount -= amount;
      await this.balanceRepository.save(balance);
  
      return { success: true, newBalance: balance.balance_amount };
    } catch (error) {
      console.error('❌ Error updating balance:', error);
      throw error;
    }
  }
}
