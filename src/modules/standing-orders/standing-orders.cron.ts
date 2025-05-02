import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StandingOrdersService } from './standing-orders.service';

@Injectable()
export class StandingOrdersCron {
  constructor(private readonly service: StandingOrdersService) {}

  @Cron('0 * * * * *') // רץ כל דקה – לצורכי בדיקות
  async handleAllowance() {
    await this.service.runScheduledAllowances();
  }
}
