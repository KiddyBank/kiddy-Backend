import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from '../challenges/entities/challenge.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { UserStats } from '../users-stats/entities/users-stat.entity';

import { Level } from '../levels/entities/level.entity';
import { LevelsModule } from '../levels/levels.module';
import { UsersModule } from '../users/users.module';
import { ChallengeInstanceController } from './challenge-instance.controller';
import { ChallengeEvaluatorFactory, ChallengeInstanceService } from './challenge-instance.service';
import { ChallengeInstance } from './entities/challenge-instance.entity';
import { UsersStatsModule } from '../users-stats/users-stats.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChallengeInstance, Challenge, UserStats, Transaction, Level]), LevelsModule, UsersModule,
    UsersStatsModule],
  controllers: [ChallengeInstanceController],
  providers: [ChallengeInstanceService, ChallengeEvaluatorFactory],
  exports: [ChallengeInstanceService, ChallengeEvaluatorFactory]
})
export class ChallengeInstanceModule { }
