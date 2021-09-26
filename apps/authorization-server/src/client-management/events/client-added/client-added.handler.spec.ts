import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { ClientAddedHandler } from './client-added.handler';
import { Client } from '../../entities/client/client.interface';
import { ClientAddedEvent } from './client-added.event';
import { ClientService } from '../../entities/client/client.service';

describe('Event: ClientAddedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: ClientAddedHandler;

  let client: ClientService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ClientAddedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: ClientService,
          useValue: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<ClientAddedHandler>(ClientAddedHandler);
    client = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should add Client using ClientService', async () => {
    client.save = jest.fn((...args) =>
      Promise.resolve({} as Client & { _id: any }),
    );
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new ClientAddedEvent({} as Client));
    expect(client.save).toHaveBeenCalledTimes(1);
  });
});
