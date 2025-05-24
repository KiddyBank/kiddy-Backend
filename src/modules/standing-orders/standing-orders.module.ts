import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { StandingOrdersService } from './standing-orders.service';
import { StandingOrdersController } from './standing-orders.controller';
import { StandingOrder } from './entities/standing-order.entity';
import { StandingOrdersCron } from './standing-orders.cron';

@Module({
  imports: [
    TypeOrmModule.forFeature([StandingOrder]),
    ScheduleModule.forRoot(),
  ],
  controllers: [StandingOrdersController],
  providers: [StandingOrdersService, StandingOrdersCron],
  exports: [StandingOrdersService],
})
export class StandingOrdersModule { }
