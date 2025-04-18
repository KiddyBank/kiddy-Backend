import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StandingOrder } from './entities/standing-order.entity';
import { CreateStandingOrderDto } from './dto/create-standing-order.dto';

@Injectable()
export class StandingOrdersService {
  constructor(
    @InjectRepository(StandingOrder)
    private readonly repo: Repository<StandingOrder>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateStandingOrderDto) {
    const balanceId = dto.balanceId;

    if (!balanceId) {
      throw new Error('Balance ID is required');
    }

    const standingOrder = this.repo.create({
      balanceId,
      amount: dto.amount,
      daysFrequency: dto.daysFrequency,
      startDate: new Date(dto.startDate),
      status: 'active',
    });

    return this.repo.save(standingOrder);
  }

  async findByBalanceId(balanceId: number) {
    return this.repo.findOne({ where: { balanceId, status: 'active' } });
  }

  async removeByBalanceId(balanceId: number) {
    const existing = await this.findByBalanceId(balanceId);
    if (existing) {
      existing.status = 'paused';
      existing.finishDate = new Date();
      return this.repo.save(existing);
    }
  }
}
