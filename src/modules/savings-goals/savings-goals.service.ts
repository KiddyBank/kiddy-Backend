import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingsGoal } from './entities/savings-goal.entity';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';
import { ChildBalance } from 'src/modules/child-balance/entities/child-balance.entity';
import { Transaction, TransactionStatus, TransactionType } from '../transactions/entities/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { SavingsGoalsTransaction } from './entities/savings-goals-transaction.entity';

@Injectable()
export class SavingsGoalsService {
  constructor(
    @InjectRepository(SavingsGoal)
    private readonly goalsRepository: Repository<SavingsGoal>,

    @InjectRepository(ChildBalance)
    private readonly balanceRepository: Repository<ChildBalance>,

    @InjectRepository(SavingsGoalsTransaction)
    private readonly goalTransactionRepository: Repository<SavingsGoalsTransaction>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    private readonly transactionsService: TransactionsService,
  ) {}


  async create(userId: string, dto: CreateSavingsGoalDto) {
    const balance = await this.balanceRepository.findOne({
      where: { child_id: userId },
    });

    if (!balance) {
      throw new NotFoundException('Balance not found for user');
    }

    const goal = this.goalsRepository.create({
      name: dto.name,
      target_amount: dto.targetAmount,
      current_amount: 0,
      balance_id: balance.balance_id,
    });

    await this.goalsRepository.save(goal);

    if (dto.initialAmount > 0) {
      await this.transactionsService.createGoalDepositTransaction(
        balance.balance_id,
        goal.id,
        dto.initialAmount,
        `הפקדה ראשונית למטרה: ${dto.name}`
      );
    }

    return goal;
  }


  findAll() {
    return this.goalsRepository.find();
  }

  async update(id: number, dto: UpdateSavingsGoalDto) {
    await this.goalsRepository.update(id, dto);
    return this.goalsRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.goalsRepository.delete(id);
    return { message: `Savings goal ${id} deleted` };
  }

  async getGoalsByUser(userId: string) {
    const balance = await this.balanceRepository.findOne({
      where: { child_id: userId },
    });

    if (!balance) return [];

    return this.goalsRepository.find({
      where: { balance_id: balance.balance_id },
      order: { created_at: 'DESC' },
    });
  }

  async getTransactionsByGoalId(goalId: number) {
    const links = await this.goalTransactionRepository.find({
      where: { goal_id: goalId },
      relations: ['transaction'],
      order: { goal_transaction_id: 'ASC' }, 
    });

    return links.map(link => link.transaction);
  }


}
