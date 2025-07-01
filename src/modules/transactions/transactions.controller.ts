import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('child-balance/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
    create(@Body() createTransactionDto: CreateTransactionDto) {
      return this.transactionsService.create(createTransactionDto);
    }


  @Patch(':id')
    update(
      @Param('id') id: string,
      @Body() updateTransactionDto: UpdateTransactionDto,
    ) {
      return this.transactionsService.update(+id, updateTransactionDto);
    }

  @Delete(':id')
    remove(@Param('id') id: string) {
      return this.transactionsService.remove(+id);
    }

  @Post('request-task-payment')
    async requestTaskPayment(@Body() body: { taskId: string; childId: string }) {
      return this.transactionsService.createTaskPaymentRequest(body.taskId, body.childId);
    }

  @Post('deposit-to-goal')
    async depositToGoal(@Body() body: {
      balanceId: number;
      goalId: number;
      amount: number;
      description?: string;
    }) {
      const { balanceId, goalId, amount, description } = body;
      return this.transactionsService.createGoalDepositTransaction(balanceId, goalId, amount, description);
    }

    @Patch('approve-store/:transactionId')
    async approveStorePurchase(
      @Param('transactionId') transactionId: string,
      @Body('parentId') parentId: string,
      @Body('action') action: 'approve' | 'reject'
    ) {
      return this.transactionsService.handleStorePurchaseApproval(parentId, transactionId, action);
    }

    @Patch('approve-deposit/:transactionId')
    async approveDepositRequest(
      @Param('transactionId') transactionId: string,
      @Body('parentId') parentId: string,
      @Body('action') action: 'approve' | 'reject'
    ) {
      return this.transactionsService.handleDepositApproval(parentId, transactionId, action);
    }


  
}
