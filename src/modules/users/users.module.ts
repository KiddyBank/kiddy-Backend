import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ChildBalance])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
