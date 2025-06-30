import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';
import { Transaction } from './entities/transaction.entity';
import { Task } from '../tasks/task.entity';
import { SavingsGoal } from '../savings-goals/entities/savings-goal.entity';
import { SavingsGoalsTransaction } from '../savings-goals/entities/savings-goals-transaction.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChildBalance,
      Transaction,
      Task,
      User,
      SavingsGoal, 
      SavingsGoalsTransaction, 
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
