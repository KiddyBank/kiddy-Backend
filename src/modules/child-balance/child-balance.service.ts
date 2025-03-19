import { Injectable } from '@nestjs/common';
import { CreateChildBalanceDto } from './dto/create-child-balance.dto';
import { UpdateChildBalanceDto } from './dto/update-child-balance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from '../balance4/balance.entity';
import { ChildBalance } from './entities/child-balance.entity';

@Injectable()
export class ChildBalanceService {
    constructor(
  @InjectRepository(Balance)
      private readonly childBalanceRepository: Repository<ChildBalance>,
    ) {}

  async getBalance(childId: string) {
      const balance = await this.childBalanceRepository.findOne({
        where: { child_id: childId, is_active: true },
      });
  
      if (!balance) {
        return { message: 'Balance not found', balance: 9 };
      }
  
      return { balance: balance.balance_amount };
    }

    
  create(createChildBalanceDto: CreateChildBalanceDto) {
    return 'This action adds a new childBalance';
  }

  findAll() {
    return `This action returns all childBalance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} childBalance`;
  }

  update(id: number, updateChildBalanceDto: UpdateChildBalanceDto) {
    return `This action updates a #${id} childBalance`;
  }

  remove(id: number) {
    return `This action removes a #${id} childBalance`;
  }
}
