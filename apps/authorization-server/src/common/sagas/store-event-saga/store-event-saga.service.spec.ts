import { Test, TestingModule } from '@nestjs/testing';
import { StoreEventSagaService } from './store-event-saga.service';

describe('StoreEventSagaService', () => {
  let service: StoreEventSagaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreEventSagaService],
    }).compile();

    service = module.get<StoreEventSagaService>(StoreEventSagaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
