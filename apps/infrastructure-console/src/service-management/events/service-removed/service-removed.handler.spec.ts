import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Service } from '../../entities/service/service.entity';
import { ServiceRemovedHandler } from './service-removed.handler';
import { ServiceRemovedEvent } from './service-removed.event';

describe('Event: ServiceRemovedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: ServiceRemovedHandler;

  const service = {} as Service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ServiceRemovedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<ServiceRemovedHandler>(ServiceRemovedHandler);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should remove Service using TypeORM', async () => {
    service.remove = jest.fn(() => Promise.resolve(service));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new ServiceRemovedEvent(service));
    expect(service.remove).toHaveBeenCalledTimes(1);
  });
});
