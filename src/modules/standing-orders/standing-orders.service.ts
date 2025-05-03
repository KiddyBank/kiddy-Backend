import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StandingOrder } from './entities/standing-order.entity';
import { CreateStandingOrderDto } from './dto/create-standing-order.dto';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';

@Injectable()
export class StandingOrdersService {
  constructor(
    @InjectRepository(StandingOrder)
    private readonly repo: Repository<StandingOrder>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateStandingOrderDto) {
    const existing = await this.findByBalanceId(dto.balanceId);
  
    if (existing) {
    // לסגור את הרשומה הקודמת
      existing.status = 'complete'; 
      existing.finishDate = new Date();
      await this.repo.save(existing);
    }
  
    // יצירת רשומה חדשה
    const newOrder = this.repo.create({
      balanceId: dto.balanceId,
      amount: dto.amount,
      daysFrequency: dto.daysFrequency,
      startDate: new Date(dto.startDate),
      status: 'active',
    });
  
    return this.repo.save(newOrder);
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

  async runScheduledAllowances() {
    const orders = await this.repo.find({ where: { status: 'active' } });
    const now = new Date();
  
    for (const order of orders) {
      if (!this.shouldRun(order, now)) continue;
  
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
  
      try {
        const balance = await queryRunner.manager.findOneBy(ChildBalance, {
          balance_id: order.balanceId,
          is_active: true,
        });
  
        if (!balance) continue;
  
        balance.balance_amount += order.amount;
        await queryRunner.manager.save(balance);
  
        order.startDate = now;
        await queryRunner.manager.save(order);
  
        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();
        console.error('⚠️ שגיאה בהרצת דמי כיס:', err);
      } finally {
        await queryRunner.release();
      }
    }
  }
  
  private shouldRun(order: StandingOrder, now: Date): boolean {
    const lastRun = new Date(order.startDate);
    const daysSinceLastRun = Math.floor((now.getTime() - lastRun.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLastRun >= order.daysFrequency;
  }
}
