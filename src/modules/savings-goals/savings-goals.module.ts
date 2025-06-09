import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingsGoalsService } from './savings-goals.service';
import { SavingsGoalsController } from './savings-goals.controller';
import { ChildBalance } from 'src/modules/child-balance/entities/child-balance.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { SavingsGoalsTransaction } from './entities/savings-goals-transaction.entity';
import { TransactionsModule } from 'src/modules/transactions/transactions.module'; 
import { SavingsGoal } from '../savings-goals/entities/savings-goal.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChildBalance,
      Transaction,
      SavingsGoal,
      SavingsGoalsTransaction,
    ]),
    TransactionsModule, 
  ],
  controllers: [SavingsGoalsController],
  providers: [SavingsGoalsService],
})
export class SavingsGoalsModule {}
