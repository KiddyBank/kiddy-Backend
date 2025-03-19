import { Test, TestingModule } from '@nestjs/testing';
import { StandingOrdersService } from './standing-orders.service';

describe('StandingOrdersService', () => {
  let service: StandingOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StandingOrdersService],
    }).compile();

    service = module.get<StandingOrdersService>(StandingOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
