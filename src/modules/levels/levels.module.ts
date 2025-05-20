import { Module } from '@nestjs/common';
import { LevelService } from './levels.service';
import { LevelsController } from './levels.controller';

@Module({
  controllers: [LevelsController],
  providers: [LevelService],
})
export class LevelsModule { }
