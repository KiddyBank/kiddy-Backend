import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParentTransactionsService } from './parent-transactions.service';
import { CreateParentTransactionDto } from './dto/create-parent-transaction.dto';
import { UpdateParentTransactionDto } from './dto/update-parent-transaction.dto';

@Controller('parent-transactions')
export class ParentTransactionsController {
  constructor(private readonly parentTransactionsService: ParentTransactionsService) {}

  @Post()
  create(@Body() createParentTransactionDto: CreateParentTransactionDto) {
    return this.parentTransactionsService.create(createParentTransactionDto);
  }

  @Get()
  findAll() {
    return this.parentTransactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentTransactionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParentTransactionDto: UpdateParentTransactionDto) {
    return this.parentTransactionsService.update(+id, updateParentTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentTransactionsService.remove(+id);
  }
}
