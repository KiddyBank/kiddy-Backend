import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { StandingOrdersService } from './standing-orders.service';
import { CreateStandingOrderDto } from './dto/create-standing-order.dto';

@Controller('standing-orders')
export class StandingOrdersController {
  constructor(private readonly service: StandingOrdersService) {}

  @Post('set-allowance')
  create(@Body() dto: CreateStandingOrderDto) {
    return this.service.create(dto);
}


  @Get('child/:balanceId')
  find(@Param('balanceId') balanceId: number) {
    return this.service.findByBalanceId(balanceId);
  }

  @Post('remove/:balanceId')
  remove(@Param('balanceId') balanceId: number) {
    return this.service.removeByBalanceId(balanceId);
  }
}
