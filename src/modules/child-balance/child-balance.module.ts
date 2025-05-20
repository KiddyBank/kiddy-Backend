import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { EducationModule } from '../education/education.module';
import { Transaction } from '../transactions/entities/transaction.entity';
import { ChildBalanceController } from './child-balance.controller';
import { ChildBalanceService } from './child-balance.service';
import { ChildBalance } from './entities/child-balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChildBalance, Transaction]), EducationModule],
  controllers: [ChildBalanceController],
  providers: [ChildBalanceService],
  exports: [ChildBalanceService],
})
export class ChildBalanceModule { }
