import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStats } from './entities/users-stat.entity';
import { UsersStatsController } from './users-stats.controller';
import { UsersStatsService } from './users-stats.service';
import { Level } from '../levels/entities/level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserStats, Level])],
  controllers: [UsersStatsController],
  providers: [UsersStatsService],
  exports: [UsersStatsService]
})
export class UsersStatsModule { }
