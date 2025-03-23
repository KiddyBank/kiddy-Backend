import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChildBalanceService } from './child-balance.service';
import { CreateChildBalanceDto } from './dto/create-child-balance.dto';
import { UpdateChildBalanceDto } from './dto/update-child-balance.dto';
import { PaymentRequestDto } from './dto/payment-request.dto';

@Controller('child-balance')
export class ChildBalanceController {
  constructor(private readonly childBalanceService: ChildBalanceService) {}



  @Post('place-payment-request/:childId')
  placePaymentRequest(@Param('childId') childId: string, @Body() paymentRequestDto: PaymentRequestDto) {
    return this.childBalanceService.placePaymentRequest(childId, paymentRequestDto);
  }

  @Post()
  create(@Body() createChildBalanceDto: CreateChildBalanceDto) {
    return this.childBalanceService.create(createChildBalanceDto);
  }

  @Get()
  findAll() {
    return this.childBalanceService.findAll();
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.childBalanceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChildBalanceDto: UpdateChildBalanceDto) {
    return this.childBalanceService.update(+id, updateChildBalanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.childBalanceService.remove(+id);
  }
}
