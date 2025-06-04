import { Controller, Get, Param } from '@nestjs/common';
import { UserLevelMatrixResponse } from './dto/user-level-stats-response';
import { UsersStatsService } from './users-stats.service';

@Controller('users-stats')
export class UsersStatsController {
  constructor(private readonly usersStatsService: UsersStatsService) { }

  @Get('levels-matrix/:userId')
  async getUserLevelMatrix(
    @Param('userId') userId: string,
  ): Promise<UserLevelMatrixResponse> {
    return this.usersStatsService.getUserLevelMatrix(userId);
  }

}
