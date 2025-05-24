import { Controller } from '@nestjs/common';
import { UsersStatsService } from './users-stats.service';

@Controller('users-stats')
export class UsersStatsController {
  constructor(private readonly usersStatsService: UsersStatsService) { }


}
