import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Service } from '../../entities/service/service.entity';
import { ServiceRegisteredHandler } from './service-registered.handler';
import { ServiceRegisteredEvent } from './service-registered.event';

describe('Event: ServiceRegisteredHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: ServiceRegisteredHandler;

  const service = {} as Service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ServiceRegisteredHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<ServiceRegisteredHandler>(
      ServiceRegisteredHandler,
    );
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should add Service using TypeORM', async () => {
    service.save = jest.fn(() => Promise.resolve(service));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new ServiceRegisteredEvent(service));
    expect(service.save).toHaveBeenCalledTimes(1);
  });
});
