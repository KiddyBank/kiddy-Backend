import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';
import { StandingOrdersModule } from '../standing-orders/standing-orders.module';
import { Task } from '../tasks/entities/task.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
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