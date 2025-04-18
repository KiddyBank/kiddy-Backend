import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';
import { Transaction } from '../transactions/entities/transaction.entity'; 
import { Task } from '../tasks/entities/task.entity';
import { StandingOrdersModule } from '../standing-orders/standing-orders.module';


@Module({
  imports: [TypeOrmModule.forFeature([User, ChildBalance, Transaction, Task]),StandingOrdersModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}