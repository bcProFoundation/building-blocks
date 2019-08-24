import { Test, TestingModule } from '@nestjs/testing';
import { EventStoreAggregateService } from './event-store-aggregate.service';
import { ConfigService } from '../../../config/config.service';
import { HttpService } from '@nestjs/common';

describe('EventStoreAggregateService', () => {
  let service: EventStoreAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventStoreAggregateService,
        {
          provide: ConfigService,
          useValue: {
            get: (...args) => 'ConfigValue',
          },
        },
        { provide: HttpService, useValue: jest.fn() },
      ],
    }).compile();

    service = module.get<EventStoreAggregateService>(
      EventStoreAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
