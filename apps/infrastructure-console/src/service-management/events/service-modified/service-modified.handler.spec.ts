import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { ServiceModifiedHandler } from './service-modified.handler';
import { Service } from '../../entities/service/service.entity';
import { ServiceModifiedEvent } from './service-modified.event';

describe('Event: ServiceModifiedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: ServiceModifiedHandler;

  const service = {} as Service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ServiceModifiedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<ServiceModifiedHandler>(ServiceModifiedHandler);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should update Service using TypeORM', async () => {
    service.save = jest.fn(() => Promise.resolve(service));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new ServiceModifiedEvent(service));
    expect(service.save).toHaveBeenCalledTimes(1);
  });
});
