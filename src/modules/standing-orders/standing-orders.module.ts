import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandingOrdersService } from './standing-orders.service';
import { StandingOrdersController } from './standing-orders.controller';
import { StandingOrder } from './entities/standing-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandingOrder])],
  controllers: [StandingOrdersController],
  providers: [StandingOrdersService],
  exports: [StandingOrdersService],
})
export class StandingOrdersModule {}
