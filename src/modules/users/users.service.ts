import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';
import { Transaction, TransactionStatus } from '../transactions/entities/transaction.entity'; 
import { Transaction, TransactionStatus } from '../transactions/entities/transaction.entity'; 
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

      const updatedTransaction = await this.transactionsRepository.update({
        transaction_id: childTransactionId
      }, {
        status: TransactionStatus.APPROVED
      });
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

    console.log(familyChildrenBalance)

    return await this.transactionsRepository.find({
      where: { balance_id: In(familyChildrenBalance.map(child => child.balance_id)),
               status: TransactionStatus.PENDING_PARENT_APPROVAL }
       });
    };

}
