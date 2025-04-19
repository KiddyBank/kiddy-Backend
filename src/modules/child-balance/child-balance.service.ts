import { Injectable } from '@nestjs/common';
import { CreateChildBalanceDto } from './dto/create-child-balance.dto';
import { UpdateChildBalanceDto } from './dto/update-child-balance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChildBalance } from './entities/child-balance.entity';
import { PaymentRequestDto } from './dto/payment-request.dto';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../transactions/entities/transaction.entity';

@Injectable()
export class ChildBalanceService {
  constructor(
    @InjectRepository(ChildBalance)
    private childBalanceRepository: Repository<ChildBalance>,

    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async placePaymentRequest(
    childId: string,
    paymentRequestDto: PaymentRequestDto,
  ) {
    const childBalance = await this.childBalanceRepository.findOne({
      where: { child_user:{user_id: childId }},
    });

    const newTransaction: Transaction = new Transaction(
      childBalance!.balance_id,
      TransactionType.STORE_PURCHASE,
      paymentRequestDto.amount,
      paymentRequestDto.description,
      TransactionStatus.PENDING_PARENT_APPROVAL
    );

    await this.transactionsRepository.save(newTransaction);
  }

  async create(createChildBalanceDto: CreateChildBalanceDto) {
    const childBalance = await this.childBalanceRepository.create(createChildBalanceDto);
    return await this.childBalanceRepository.save(childBalance);
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
