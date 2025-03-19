import { Module } from '@nestjs/common';
import { ChildBalanceService } from './child-balance.service';
import { ChildBalanceController } from './child-balance.controller';

@Module({
  controllers: [ChildBalanceController],
  providers: [ChildBalanceService],
  exports: [ChildBalanceService]
})
export class ChildBalanceModule {}
