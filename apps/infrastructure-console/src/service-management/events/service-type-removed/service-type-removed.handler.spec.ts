import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { ServiceTypeRemovedEvent } from './service-type-removed.event';
import { ServiceTypeRemovedHandler } from './service-type-removed.handler';
import { ServiceType } from '../../entities/service-type/service-type.entity';

describe('Event: ServiceRemovedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: ServiceTypeRemovedHandler;

  const service = {} as ServiceType;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ServiceTypeRemovedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<ServiceTypeRemovedHandler>(
      ServiceTypeRemovedHandler,
    );
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should remove ServiceType using TypeORM', async () => {
    service.remove = jest.fn(() => Promise.resolve(service));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new ServiceTypeRemovedEvent(service));
    expect(service.remove).toHaveBeenCalledTimes(1);
  });
});
