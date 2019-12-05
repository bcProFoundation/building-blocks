import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { EventStoreAggregateService } from './event-store-aggregate.service';
import { ConfigService } from '../../../config/config.service';
import { EVENT_SERVICE } from '../../../event-store/microservice/event-service.provider';

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
        { provide: EVENT_SERVICE, useValue: {} },
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
