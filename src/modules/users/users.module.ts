import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Task } from '../tasks/task.entity';
import { StandingOrdersModule } from '../standing-orders/standing-orders.module';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';


@Module({
  imports: [TypeOrmModule.forFeature([User, ChildBalance, Transaction, Task]), StandingOrdersModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }