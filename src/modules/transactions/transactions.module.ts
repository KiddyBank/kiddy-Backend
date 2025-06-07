import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';
import { Transaction } from './entities/transaction.entity';
import { Task } from '../tasks/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChildBalance, Transaction,Task]) ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
