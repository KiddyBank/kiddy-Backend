import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';
import { Transaction, TransactionStatus, TransactionType } from '../transactions/entities/transaction.entity'; 
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

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email }
    });
  }
  
  async createParent(dto: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create({
      ...dto,
      user_role: UserRole.PARENT,
    });
    return await this.usersRepository.save(newUser);
  }
  
  async getChildBalanceFromUuid(userId: string):Promise<ChildBalance> {
    return await this.balanceRepository.findOne({
      where: { child_user: { user_id: userId } },
    }).then(balance => {
      if (!balance) {
        throw new Error('Balance not found');
      }
      return balance;
    });
  }


  async getBalance(userId: string) {
    try {
      const balance = await this.getChildBalanceFromUuid(userId);

      if (!balance) {
        return { balance: 0, message: 'Balance not found' };
      }

      return { balance: balance.balance_amount };
    } catch (error) {
      throw error;
    }
  }

  async getTransactions(childId: string, transactionType?:string, transactionStatus?:string) {

    try {
      const childBalance = (await this.getChildBalanceFromUuid(childId));

      const whereConditions: FindOptionsWhere<Transaction> = {
        balance_id: childBalance.balance_id,
        ...(transactionType && { type: transactionType as TransactionType }),
        ...(transactionStatus && { status: transactionStatus as TransactionStatus }),
      };

      const transactions = await this.transactionsRepository.find({
        where: whereConditions,
        order: { created_at: 'DESC' },
      });

      return transactions;
    } catch (error) {
      throw error;
    }
  }

  async getTasks(childId: string) {
    try {
      const balanceId = (await this.getChildBalanceFromUuid(childId)).balance_id;

      const tasks = await this.tasksRepository.find({
        where: { balance_id: balanceId },
      });
  
      return tasks;
    } catch (error) {
      console.error('❌ Error fetching tasks:', error);
      return []; 
    }
  }

    async deductBalance(childId: string, transactionId: string) {
      try {

        const balance = await this.getChildBalanceFromUuid(childId);
        const transaction = await this.transactionsRepository.findOne({
          where: { transaction_id: transactionId }
        });
        
        if (!balance) {
          return { success: false, message: 'Balance not found' };
        }

        if (!transaction) {
          return { success: false, message: 'Transaction not found' };
        }

        if (balance.balance_id !== transaction!.child_balance.balance_id) {
          return { success: false, message: `Cant pay for whats not yours! ${balance.balance_id}, ${transaction!.child_balance.balance_id}` };
          
        }

        balance.balance_amount -= transaction.amount;
        await this.balanceRepository.save(balance);
        transaction!.status=TransactionStatus.COMPLETED;
        await this.transactionsRepository.save(transaction);
        return { success: true, newBalance: balance.balance_amount };

      } catch (error) {
        console.error('❌ Error updating balance:', error);
        throw error;
      }
    }

  async approveChildPaymentReuqest(parentId:string, childTransactionId: string) {

      const pendingTransaction = await this.transactionsRepository.findOne({
        where: { transaction_id: childTransactionId }
      });

      const child = await this.usersRepository.findOne({ where: { user_id: pendingTransaction!.child_balance.child_user.user_id }});
      const parent = await this.usersRepository.findOne({ where: { user_id: parentId }});

      const childFamilyId: number = child?.family.id!;
      const parentFamilyId: number = parent?.family.id!;

      if (childFamilyId !== parentFamilyId) {
        console.error('❌ Mismatch between parent and child family id');
        throw new Error('Mismatch between parent and child family id');
      }

      await this.transactionsRepository.update({
        transaction_id: childTransactionId
      }, {
        status: TransactionStatus.APPORVED_BY_PARENT
      });
  }

  async getChildrenPaymentReuqests(parentId:string) {
    const parentUser = await this.usersRepository.findOne({where: { user_id: parentId }});
    const parentFamilyId: number = parentUser!.family.id;

    const familyChildren = await this.usersRepository.find({
      where: { family: { id: parentFamilyId } } });

    const familyChildrenBalance = await this.balanceRepository.find({
      where: {
        child_user: {
          user_id: 
             In(familyChildren.map(child => child.user_id))
        }
      }
    });

    return await this.transactionsRepository.find({
      where: { balance_id: In(familyChildrenBalance.map(child => child.balance_id)),
               status: TransactionStatus.PENDING_PARENT_APPROVAL }
       });
  
  }
}
