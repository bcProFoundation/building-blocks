import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Client } from '../../entities/client/client.interface';
import { ClientSecretVerifiedHandler } from './client-secret-verified.handler';
import { ClientSecretVerifiedEvent } from './client-secret-verified.event';
import { ClientService } from '../../entities/client/client.service';

describe('Event: ClientSecretUpdatedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: ClientSecretVerifiedHandler;

  let client: ClientService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ClientSecretVerifiedHandler,
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
    eventHandler = module.get<ClientSecretVerifiedHandler>(
      ClientSecretVerifiedHandler,
    );
    client = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should modify Client using ClientService', async () => {
    client.save = jest.fn((...args) =>
      Promise.resolve({} as Client & { _id: any }),
    );
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new ClientSecretVerifiedEvent({} as Client));
    expect(client.save).toHaveBeenCalledTimes(1);
  });
});
