import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Client } from '../../entities/client/client.interface';
import { ClientModifiedHandler } from './client-modified.handler';
import { ClientModifiedEvent } from './client-modified.event';

describe('Event: ClientModifiedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: ClientModifiedHandler;

  const client = {} as Client;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ClientModifiedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<ClientModifiedHandler>(ClientModifiedHandler);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should modify Client using Mongoose', async () => {
    client.save = jest.fn(() => Promise.resolve(client));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new ClientModifiedEvent(client));
    expect(client.save).toHaveBeenCalledTimes(1);
  });
});
