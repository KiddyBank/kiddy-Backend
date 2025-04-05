import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { User } from './user.entity';
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


  async getChildBalanceFromUuid(userId: string):Promise<ChildBalance> {
    return await this.balanceRepository.findOne({
      where: { child_id: userId },
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
      const balanceId = (await this.getChildBalanceFromUuid(childId)).balance_id;

      const whereConditions: FindOptionsWhere<Transaction> = {
        balance_id: balanceId,
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

  async getUserFamilyId(userId: string):Promise<number> {

    const childMetadata = await this.usersRepository.findOne({
      where: { user_id: userId },
    });

    return childMetadata!.family_id;
}

  async getChildsFamilyId(balanceId: number):Promise<number> {

      const childBalance = await this.balanceRepository.findOne({
        where: { balance_id: balanceId },
      });

      const childsId = childBalance!.child_id

      return await this.getUserFamilyId(childsId)

  }

    async deductBalance(childId: string, transactionId: string) {
      try {

        const balance = await this.getChildBalanceFromUuid(childId);

        console.log('Balance:', balance);
        console.log('Transaction ID:', transactionId);

        const transaction = await this.transactionsRepository.findOne({
          where: { transaction_id: transactionId }
        });

        console.log('Transaction:', transaction);

        if (!balance) {
          return { success: false, message: 'Balance not found' };
        }

        if (!transaction) {
          return { success: false, message: 'Transaction not found' };
        }

        if (balance.balance_id !== transaction!.balance_id) {
          return { success: false, message: 'Cant pay for whats not yours!' };
          
        }

        balance.balance_amount -= transaction.amount;
        await this.balanceRepository.save(balance);
        transaction!.status=TransactionStatus.COMPLETED;
        await this.transactionsRepository.save(transaction);

        console.log('Transaction completed:', transaction);
    
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

      const childFamilyId: number = await this.getChildsFamilyId(pendingTransaction!.balance_id)
      const parentFamilyId: number = await this.getUserFamilyId(parentId)

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

    const parentFamilyId: number = await this.getUserFamilyId(parentId)
    const familyChildren = await this.usersRepository.find({  where: { family_id: parentFamilyId } });


    const familyChildrenBalance = await this.balanceRepository.find({
      where: { child_id: In(familyChildren.map(child => child.user_id)) }
    });

    return await this.transactionsRepository.find({
      where: { balance_id: In(familyChildrenBalance.map(child => child.balance_id)),
               status: TransactionStatus.PENDING_PARENT_APPROVAL }
       });
    };

}
