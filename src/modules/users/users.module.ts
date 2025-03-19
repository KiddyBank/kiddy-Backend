import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Balance } from '../balance4/balance.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Balance])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
