import { Injectable } from '@nestjs/common';
import { CreateParentTransactionDto } from './dto/create-parent-transaction.dto';
import { UpdateParentTransactionDto } from './dto/update-parent-transaction.dto';

@Injectable()
export class ParentTransactionsService {
  create(createParentTransactionDto: CreateParentTransactionDto) {
    return 'This action adds a new parentTransaction';
  }

  findAll() {
    return `This action returns all parentTransactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parentTransaction`;
  }

  update(id: number, updateParentTransactionDto: UpdateParentTransactionDto) {
    return `This action updates a #${id} parentTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} parentTransaction`;
  }
}
