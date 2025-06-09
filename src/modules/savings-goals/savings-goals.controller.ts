import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';
import { SavingsGoalsService } from './savings-goals.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('savings-goals')
export class SavingsGoalsController {
  constructor(private readonly savingsGoalsService: SavingsGoalsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req, @Body() createSavingsGoalDto: CreateSavingsGoalDto) {
    const userId = req.user.sub;
    return this.savingsGoalsService.create(userId, createSavingsGoalDto);
  }

  @Get()
  findAll() {
    return this.savingsGoalsService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSavingsGoalDto: UpdateSavingsGoalDto,
  ) {
    return this.savingsGoalsService.update(+id, updateSavingsGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savingsGoalsService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'))
    @Get('by-user')
    async getGoalsByUser(@Req() req) {
      const userId = req.user.sub;
      return this.savingsGoalsService.getGoalsByUser(userId);
}

@UseGuards(AuthGuard('jwt'))
  @Get(':goalId/transactions')
  getGoalTransactions(@Param('goalId') goalId: number) {
    return this.savingsGoalsService.getTransactionsByGoalId(goalId);
  }


}
