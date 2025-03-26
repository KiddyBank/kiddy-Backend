import { Controller, Get, Param, Patch, Body, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaymentAcceptDto } from './dto/payment-accept.dto';
import { PerformPaymentDto } from './dto/perform-payment.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('parents/:parentId/children-playment-requests')
  getChildrenPaymentRequests(@Param('parentId') parentId: string) {  
    return this.usersService.getChildrenPaymentReuqests(parentId);
  }

  @Post('parents/:parentId/accept-payment-request')
  approveChildPaymentRequest(@Param('userId') parentId: string, @Body() paymentRequestDto: PaymentAcceptDto) {  
    this.usersService.approveChildPaymentReuqest(parentId, paymentRequestDto.transactionId);
  }

  @Get('balance/:userId')
  getBalance(@Param('userId') userId: string) {
    return this.usersService.getBalance(userId);
  }

  @Get('balance')
  getFixedBalance() {
    const fixedUserId = process.env.DEFAULT_CHILD_ID as string; // ילד דיפולטי
    return this.usersService.getBalance(fixedUserId);
  }

  @Get('transactions')
  getFixedTransactions(@Query('transaction_type') transaction_type?:string, @Query('transaction_status') transaction_status?:string) {
    const fixedBalanceId =  Number(process.env.DEFAULT_BALANCE_ID); // balance_id דיפולטי
    return this.usersService.getFixedTransactions(fixedBalanceId, transaction_type, transaction_status); ;
  } 

  @Get('tasks')
  getFixedTasks() {
    const fixedBalanceId =  Number(process.env.DEFAULT_BALANCE_ID); // balance_id דיפולטי
    return this.usersService.getFixedTasks(fixedBalanceId);
  }

  @Get('test')
  test() {
    return 'Controller working!';
  }

  @Post('perform-payment/:userId')
  async updateBalance(
    @Param('userId') userId: string,
    @Body() performPaymentDto: PerformPaymentDto
  ) {
    return await this.usersService.deductBalance(userId, performPaymentDto.transactionId);
  }
}
