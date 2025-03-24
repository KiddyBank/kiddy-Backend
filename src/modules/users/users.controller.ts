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
    const fixedUserId = 'ac0d5b82-88cd-4d87-bdd6-3503602f6d81'; // ילד דיפולטי
    return this.usersService.getBalance(fixedUserId);
  }

  @Get('transactions')
  getFixedTransactions() {
    const fixedBalanceId = 1; // balance_id דיפולטי
    return this.usersService.getFixedTransactions(fixedBalanceId);
  } 

  @Get('tasks')
  getFixedTasks() {
    const fixedBalanceId = 1; // balance_id דיפולטי
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
