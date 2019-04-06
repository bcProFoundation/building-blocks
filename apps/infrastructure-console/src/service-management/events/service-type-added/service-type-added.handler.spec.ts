import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { ServiceTypeAddedHandler } from './service-type-added.handler';
import { ServiceTypeAddedEvent } from './service-type-added.event';
import { ServiceType } from '../../entities/service-type/service-type.entity';

describe('Event: ServiceTypeAddedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: ServiceTypeAddedHandler;

  const serviceType = {} as ServiceType;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ServiceTypeAddedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<ServiceTypeAddedHandler>(ServiceTypeAddedHandler);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should add ServiceType using TypeORM', async () => {
    serviceType.save = jest.fn(() => Promise.resolve(serviceType));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new ServiceTypeAddedEvent(serviceType));
    expect(serviceType.save).toHaveBeenCalledTimes(1);
  });
});
