import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStats } from '../users-stats/entities/users-stat.entity';
import { Level } from './entities/level.entity';
import { LevelsController } from './levels.controller';
import { LevelService } from './levels.service';

@Module({
  imports: [TypeOrmModule.forFeature([Level, UserStats])],
  controllers: [LevelsController],
  providers: [LevelService],
  exports: [LevelService],
})
export class LevelsModule { }
