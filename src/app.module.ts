  import { Module } from '@nestjs/common';
  import { ConfigModule } from '@nestjs/config';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { ChildBalanceModule } from './modules/child-balance/child-balance.module';
  import { FamilyModule } from './modules/family/family.module';
  import { TransactionsModule } from './modules/transactions/transactions.module';
  import { UsersModule } from './modules/users/users.module';
  import { TasksModule } from './modules/tasks/tasks.module';
  import { StandingOrdersModule } from './modules/standing-orders/standing-orders.module';
  import { AuthModule } from './modules/auth/auth.module';
  import { SavingsGoalsModule } from './modules/savings-goals/savings-goals.module';
  import { ScheduleModule } from '@nestjs/schedule';
  import { StandingOrder } from './modules/standing-orders/entities/standing-order.entity';


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
      SavingsGoalsModule,
      ScheduleModule.forRoot(),

    ],
  })
  export class AppModule { }
