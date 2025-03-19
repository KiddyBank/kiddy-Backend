import { Injectable } from '@nestjs/common';
import { CreateStandingOrderDto } from './dto/create-standing-order.dto';
import { UpdateStandingOrderDto } from './dto/update-standing-order.dto';

@Injectable()
export class StandingOrdersService {
  create(createStandingOrderDto: CreateStandingOrderDto) {
    return 'This action adds a new standingOrder';
  }

  findAll() {
    return `This action returns all standingOrders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} standingOrder`;
  }

  update(id: number, updateStandingOrderDto: UpdateStandingOrderDto) {
    return `This action updates a #${id} standingOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} standingOrder`;
  }
}
