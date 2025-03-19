import { Test, TestingModule } from '@nestjs/testing';
import { StandingOrdersController } from './standing-orders.controller';
import { StandingOrdersService } from './standing-orders.service';

describe('StandingOrdersController', () => {
  let controller: StandingOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StandingOrdersController],
      providers: [StandingOrdersService],
    }).compile();

    controller = module.get<StandingOrdersController>(StandingOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
