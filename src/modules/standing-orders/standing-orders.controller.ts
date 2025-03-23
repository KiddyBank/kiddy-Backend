import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StandingOrdersService } from './standing-orders.service';
import { CreateStandingOrderDto } from './dto/create-standing-order.dto';
import { UpdateStandingOrderDto } from './dto/update-standing-order.dto';

@Controller('standing-orders')
export class StandingOrdersController {
  constructor(private readonly standingOrdersService: StandingOrdersService) {}

  @Post()
  create(@Body() createStandingOrderDto: CreateStandingOrderDto) {
    return this.standingOrdersService.create(createStandingOrderDto);
  }

  @Get()
  findAll() {
    return this.standingOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.standingOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStandingOrderDto: UpdateStandingOrderDto,
  ) {
    return this.standingOrdersService.update(+id, updateStandingOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.standingOrdersService.remove(+id);
  }
}
