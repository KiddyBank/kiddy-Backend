import { Module } from '@nestjs/common';
import { ChildBalanceService } from './child-balance.service';
import { ChildBalanceController } from './child-balance.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ChildBalance } from './entities/child-balance.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChildBalance, Transaction])],
  controllers: [ChildBalanceController],
  providers: [ChildBalanceService],
  exports: [ChildBalanceService],
})
export class ChildBalanceModule {}
