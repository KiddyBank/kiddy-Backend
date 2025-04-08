import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChildBalance } from '../child-balance/entities/child-balance.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
 constructor(

    @InjectRepository(ChildBalance)
    private childBalanceRepository: Repository<ChildBalance>,

    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }


  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
