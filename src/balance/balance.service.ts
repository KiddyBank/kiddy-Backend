import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from './balance.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
  ) {}

  async getBalance(childId: string) {
    const balance = await this.balanceRepository.findOne({
      where: { child_id: childId, is_active: true },
    });

    if (!balance) {
      return { message: 'Balance not found', balance: 9 };
    }

    return { balance: balance.balance_amount };
  }
}
