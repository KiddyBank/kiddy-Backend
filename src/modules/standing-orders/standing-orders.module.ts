import { Module } from '@nestjs/common';
import { StandingOrdersService } from './standing-orders.service';
import { StandingOrdersController } from './standing-orders.controller';

@Module({
  controllers: [StandingOrdersController],
  providers: [StandingOrdersService],
})
export class StandingOrdersModule {}
