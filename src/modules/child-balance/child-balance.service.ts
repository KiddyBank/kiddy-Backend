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
      where: { child_id: childId },
    });

    const newTransaction: Transaction = new Transaction(
      childBalance!.balance_id,
      TransactionType.REQUEST_FOR_PAYMENT,
        paymentRequestDto.amount,
        paymentRequestDto.description,
      TransactionStatus.PENDING_PARENT_APPROVAL
    );

    await this.transactionsRepository.save(newTransaction);
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

  async chargeOneShekel(childId: string) {
  
    const childBalance = await this.childBalanceRepository.findOne({
      where: { child_id: childId },
    });
  
    if (!childBalance) {
      throw new Error("ילד לא נמצא");
    }
  
    const transaction = new Transaction(
      childBalance.balance_id,
      TransactionType.STORE_PURCHASE,
      1,
      'רכישה באשראי',
      TransactionStatus.PENDING_STORE
    );
  
    const savedTransaction = await this.transactionsRepository.save(transaction);

    childBalance.balance_amount -= 1;
    await this.childBalanceRepository.save(childBalance);
  
    savedTransaction.status = TransactionStatus.COMPLETED;
    await this.transactionsRepository.save(savedTransaction);
  
    return childBalance;
  }
}
