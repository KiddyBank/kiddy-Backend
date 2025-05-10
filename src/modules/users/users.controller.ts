import { Controller, Get, Param, Body, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaymentAcceptDto } from './dto/payment-accept.dto';
import { PerformPaymentDto } from './dto/perform-payment.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('parents/:parentId/children-payment-requests')
  getChildrenPaymentRequests(@Param('parentId') parentId: string) {
    return this.usersService.getChildrenPaymentReuqests(parentId);
  }

  @Get('parents/:parentId/children')
  getParentChildren(@Param('parentId') parentId: string) {
    return this.usersService.getParentChildren(parentId);
  }

  @Post('parents/:parentId/handle-payment-request')
  handleChildPaymentRequest(@Param('parentId') parentId: string, @Body() body: { transactionId: string; action: 'approve' | 'reject' }) {
    return this.usersService.handleChildPaymentRequest(parentId, body.transactionId, body.action);
  }

  @Get('balance/:childId')
  getFixedBalance(@Param('childId') childId: string) {
    return this.usersService.getBalance(childId);
  }

  @Get('transactions/:childId')
  getFixedTransactions(@Param('childId') childId: string, @Query('transaction_type') transaction_type?: string, @Query('transaction_status') transaction_status?: string) {
    return this.usersService.getTransactions(childId, transaction_type, transaction_status);;
  }

  @Get('tasks/:childId')
  getFixedTasks(@Param('childId') childId: string) {
    return this.usersService.getTasks(childId);
  }

  @Post('perform-payment/:childId')
  async updateBalance(
    @Param('childId') childId: string,
    @Body() performPaymentDto: PerformPaymentDto
  ) {
    return await this.usersService.deductBalance(childId, performPaymentDto.transactionId);
  }

  @Get('parents/:parentId/children')
  getChildrenOfParent(@Param('parentId') parentId: string) {
    return this.usersService.getParentChildren(parentId);
  }

}

