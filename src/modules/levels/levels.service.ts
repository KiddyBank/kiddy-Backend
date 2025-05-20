import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserStats } from "../users-stats/entities/users-stat.entity";
import { User } from "../users/user.entity";
import { Level } from "./entities/level.entity";

@Injectable()
export class LevelService {
  constructor(private readonly userRepo: Repository<User>,
    private readonly levelSubjectRepo: Repository<Level>,
    private readonly userStats: Repository<UserStats>,
    private readonly userStatsRepo: Repository<UserStats>
  ) { }

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
    const userStats = await this.userStats.findOneBy({ user_id: userId });
    if (userStats?.current_level_xp == userStats?.total_xp) {
      return (userStats?.level_id! + 1);
    }
    return userStats?.level_id!;
  }

  async getLevelCategory(level: number): Promise<string> {
    const row = await this.levelSubjectRepo.findOneBy({ id: level });

    if (!row) {
      throw new Error(`No subject category defined for level ${level}`);
    }

    return row.category;
  }
}
