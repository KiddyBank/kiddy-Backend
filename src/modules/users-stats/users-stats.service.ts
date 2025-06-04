import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserStats } from './entities/users-stat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLevelMatrixResponse, LevelProgressDTO, LevelStatus } from './dto/user-level-stats-response';
import { Level } from '../levels/entities/level.entity';

@Injectable()
export class UsersStatsService {
  constructor(
    @InjectRepository(UserStats)
    private readonly userStatsRepo: Repository<UserStats>,
    @InjectRepository(Level)
    private readonly levelRepo: Repository<Level>,
  ) { }

  async createForUser(userId: string) {
    return this.userStatsRepo.save({
      user_id: userId,
      current_level_xp: 0,
      total_xp: 0,
      level_id: 1,
      updated_at: new Date()
    });
  }

  async getUserLevel(userId: string): Promise<number> {
    const userStats = await this.userStatsRepo.findOne({
      where: { user_id: userId },
    });

    if (!userStats) {
      throw new Error(`User stats not found for user ID: ${userId}`);
    }

    return userStats.level_id;
  }

  async evaluateLevel(userId: string): Promise<number> {
    const userStats = await this.userStatsRepo.findOne({
      where: { user_id: userId },
      relations: ['level'],
    });
    console.log(`current level xp: ${userStats?.current_level_xp!} required xp: ${userStats?.level?.xp_required!}`);
    if (userStats?.current_level_xp! >= userStats?.level?.xp_required!) {

      await this.userStatsRepo.update(
        { user_id: userId },
        { level_id: userStats?.level_id! + 1, current_level_xp: 0 },

      );
      return (userStats?.level_id! + 1);
    }

    return userStats?.level_id!;
  }

  async getLevelCategory(level: number): Promise<string> {
    const row = await this.levelRepo.findOneBy({ id: level });

    if (!row) {
      throw new Error(`No subject category defined for level ${level}`);
    }

    return row.category;
  }

  async getUserLevelMatrix(userId: string): Promise<UserLevelMatrixResponse> {
    const stats = await this.userStatsRepo.findOneOrFail({ where: { user_id: userId } });
    const allLevels = await this.levelRepo.find({ order: { id: 'ASC' } });

    const levels: LevelProgressDTO[] = allLevels.map(level => {
      const userTotalXp = stats.total_xp;
      const userCurrentLevelId = stats.level_id;
      const userCurrentLevelXp = stats.current_level_xp;

      const isCurrentLevel = userCurrentLevelId === level.id;
      const isCompleted = userTotalXp >= level.xp_required;

      let status: LevelStatus;
      let pointsEarned = 0;

      if (isCompleted) {
        status = LevelStatus.COMPLETED;
        pointsEarned = level.xp_required;
      } else if (isCurrentLevel) {
        status = LevelStatus.IN_PROGRESS;
        pointsEarned = userCurrentLevelXp;
      } else {
        status = LevelStatus.LOCKED;
      }

      return {
        id: level.id.toString(),
        name: level.name,
        icon: level.icon,
        status,
        pointsRequired: level.xp_required,
        pointsEarned,
      };
    });


    return {
      currentLevelId: stats.level_id,
      currentLevelXp: stats.current_level_xp,
      totalXp: stats.total_xp,
      levels,
    };
  }


}

