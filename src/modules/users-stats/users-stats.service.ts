import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserStats } from './entities/users-stat.entity';

@Injectable()
export class UsersStatsService {
  constructor(
    private readonly userStatRepository: Repository<UserStats>,
  ) { }

  async createForUser(userId: string) {
    return this.userStatRepository.save({
      user_id: userId,
      current_level_xp: 0,
      total_xp: 0,
      level_id: 1,
      updated_at: new Date()
    });
  }

}
