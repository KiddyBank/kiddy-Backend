import { Module } from '@nestjs/common';
import { ParentTransactionsService } from './parent-transactions.service';
import { ParentTransactionsController } from './parent-transactions.controller';

@Module({
  controllers: [ParentTransactionsController],
  providers: [ParentTransactionsService],
})
export class ParentTransactionsModule {}
