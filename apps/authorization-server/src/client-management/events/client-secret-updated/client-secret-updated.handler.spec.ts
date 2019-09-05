import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Client } from '../../entities/client/client.interface';
import { ClientSecretUpdatedHandler } from './client-secret-updated.handler';
import { ClientSecretUpdatedEvent } from './client-secret-updated.event';
import { ClientService } from '../../entities/client/client.service';

describe('Event: ClientSecretUpdatedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: ClientSecretUpdatedHandler;

  let client: ClientService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ClientSecretUpdatedHandler,
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
    eventHandler = module.get<ClientSecretUpdatedHandler>(
      ClientSecretUpdatedHandler,
    );
    client = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should modify Client using ClientService', async () => {
    client.save = jest.fn((...args) => Promise.resolve({} as Client));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new ClientSecretUpdatedEvent({} as Client));
    expect(client.save).toHaveBeenCalledTimes(1);
  });
});
