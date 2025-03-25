import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  getFixedTransactions() {
    const fixedBalanceId =  Number(process.env.DEFAULT_BALANCE_ID); // balance_id דיפולטי
    return this.usersService.getFixedTransactions(fixedBalanceId) ;
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

  @Patch('balance/:userId')
  async updateBalance(
    @Param('userId') userId: string,
    @Body('amount') amount: number,
  ) {
    return await this.usersService.deductBalance(userId, amount);
  }
}
