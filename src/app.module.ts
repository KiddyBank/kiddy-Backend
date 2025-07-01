import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ChildBalanceModule } from './modules/child-balance/child-balance.module';
import { FamilyModule } from './modules/family/family.module';
import { SavingsGoalsModule } from './modules/savings-goals/savings-goals.module';
import { StandingOrder } from './modules/standing-orders/entities/standing-order.entity';
import { StandingOrdersModule } from './modules/standing-orders/standing-orders.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';

import { ChallengeInstanceModule } from './modules/challenge-instance/challenge-instance.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { EducationModule } from './modules/education/education.module';
import { LevelsModule } from './modules/levels/levels.module';
import { UsersStatsModule } from './modules/users-stats/users-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
      entities: [
        StandingOrder,
        __dirname + '/**/*.entity{.ts,.js}',
      ],
      synchronize: false,
    }),

    UsersModule,
    ChildBalanceModule,
    FamilyModule,
    TransactionsModule,
    TasksModule,
    StandingOrdersModule,
    AuthModule,
    EducationModule,
    ChallengeInstanceModule,
    ChallengesModule,
    UsersStatsModule,
    LevelsModule,
    SavingsGoalsModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule { }
