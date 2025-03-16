import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('balance/:userId')
  getBalance(@Param('userId') userId: string) {
    return this.usersService.getBalance(userId);
  }
}
