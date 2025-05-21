import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';
import { StandingOrdersService } from '../standing-orders/standing-orders.service';
import { Task } from '../tasks/task.entity';
import { Transaction, TransactionStatus, TransactionType } from '../transactions/entities/transaction.entity';
import { User, UserRole } from './user.entity';

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

    private readonly standingOrdersService: StandingOrdersService,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email }
    });
  }

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  async getChildBalanceFromUuid(userId: string): Promise<ChildBalance> {
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

  async getTransactions(childId: string, transactionType?: string, transactionStatus?: string) {

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
      transaction!.status = TransactionStatus.COMPLETED;
      await this.transactionsRepository.save(transaction);
      return { success: true, newBalance: balance.balance_amount };

    } catch (error) {
      console.error('❌ Error updating balance:', error);
      throw error;
    }
  }

  async handleChildPaymentRequest(
    parentId: string,
    childTransactionId: string,
    action: 'approve' | 'reject'
  ) {
    const pendingTransaction = await this.transactionsRepository.findOne({
      where: { transaction_id: childTransactionId },
      relations: ['child_balance', 'child_balance.child_user', 'child_balance.child_user.family']
    });

    if (!pendingTransaction) {
      throw new Error('Transaction not found');
    }

    const child = await this.usersRepository.findOne({ where: { user_id: pendingTransaction!.child_balance.child_user.user_id } });
    const parent = await this.usersRepository.findOne({ where: { user_id: parentId } });

    const childFamilyId: number = child?.family.id!;
    const parentFamilyId: number = parent?.family.id!;

    if (childFamilyId !== parentFamilyId) {
      console.error('❌ Mismatch between parent and child family id');
      throw new Error('Mismatch between parent and child family id');
    }

    const status =
      action === 'approve'
        ? TransactionStatus.APPORVED_BY_PARENT
        : TransactionStatus.REJECTED;

    return this.transactionsRepository.update(
      { transaction_id: childTransactionId },
      { status }
    );
  }

  async getChildrenPaymentReuqests(parentId: string) {
    const { balances } = await this._getParentChildren(parentId);

    return await this.transactionsRepository.find({
      where: {
        balance_id: In(balances.map(child => child.balance_id)),
        status: TransactionStatus.PENDING_PARENT_APPROVAL
      },
      relations: ['child_balance', 'child_balance.child_user'] 
    });
  }


  async getParentChildren(parentId: string) {
    const { children, balances } = await this._getParentChildren(parentId);

    const balanceMap = new Map(
      balances.map((b) => [
        b.child_user.user_id,
        {
          amount: b.balance_amount,
          id: b.balance_id,
        },
      ])
    );

    const standingOrders = await Promise.all(
      balances.map((b) => this.standingOrdersService.findByBalanceId(b.balance_id))
    );

    const standingMap = new Map(
      standingOrders
        .filter(Boolean)
        .map((order) => [
          order!.balanceId,
          {
            amount: order!.amount,
            interval: order!.daysFrequency,
          },
        ])
    );

    return children.map((child) => {
      const balanceInfo = balanceMap.get(child.user_id);
      const standing = balanceInfo?.id ? standingMap.get(balanceInfo.id) : null;
      
      return {
        id: child.user_id,
        name: child.username,
        gender: child.gender,
        imageUrl: child.avatar_path || '/avatars/avatar-boy.png',
        balance: balanceInfo?.amount || 0,
        balanceId: balanceInfo?.id || null,
        allowanceAmount: standing?.amount || null,
        allowanceInterval:
          standing?.interval === 30
            ? 'monthly'
            : standing?.interval === 7
            ? 'weekly'
            : standing?.interval === 0
            ? 'test'
            : undefined,
      };
    });
  }

  async _getParentChildren(parentId: string): Promise<{
    children: User[];
    balances: ChildBalance[];
  }> {
    const parent = await this.usersRepository.findOne({
      where: { user_id: parentId, user_role: UserRole.PARENT },
      relations: ['family'],
    });

    if (!parent || !parent.family) {
      throw new Error('Parent or family not found');
    }

    const children = await this.usersRepository.find({
      where: {
        family: { id: parent.family.id },
        user_role: UserRole.CHILD,
      },
    });

    const balances = await this.balanceRepository.find({
      where: {
        child_user: {
          user_id: In(children.map(child => child.user_id)),
        },
      },
      relations: ['child_user'],
    });

    return {
      children,
      balances,
    };
  }





}
