import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Balance } from '../balance/balance.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
  ) {}

  async getBalance(userId: string) {

    try {
      const balance = await this.balanceRepository.findOne({
        where: { child_id: userId },
      });


      if (!balance) {
        return { balance: 0, message: 'Balance not found' };
      }

      return { balance: balance.balance_amount };
    } catch (error) {
      throw error;
    }
  }
}
