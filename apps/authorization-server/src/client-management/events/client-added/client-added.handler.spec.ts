import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { ClientAddedHandler } from './client-added.handler';
import { Client } from '../../entities/client/client.interface';
import { ClientAddedEvent } from './client-added.event';

describe('Event: ClientAddedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: ClientAddedHandler;

  const client = {} as Client;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ClientAddedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<ClientAddedHandler>(ClientAddedHandler);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should add Client using Mongoose', async () => {
    client.save = jest.fn(() => Promise.resolve(client));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new ClientAddedEvent(client));
    expect(client.save).toHaveBeenCalledTimes(1);
  });
});
