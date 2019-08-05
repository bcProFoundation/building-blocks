import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { BearerTokenRemovedHandler } from './bearer-token-removed.handler';
import { BearerTokenRemovedEvent } from './bearer-token-removed.event';
import { BearerToken } from '../../entities/bearer-token/bearer-token.interface';
import { HttpModule } from '@nestjs/common';
import { ClientService } from '../../../client-management/entities/client/client.service';

describe('Event: BearerTokenRemovedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: BearerTokenRemovedHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, HttpModule],
      providers: [
        BearerTokenRemovedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        { provide: ClientService, useValue: {} },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<BearerTokenRemovedHandler>(
      BearerTokenRemovedHandler,
    );
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should remove BearerToken using Mongoose', async () => {
    const token = {} as BearerToken;
    token.remove = jest.fn(() => Promise.resolve(token));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new BearerTokenRemovedEvent(token));
    expect(token.remove).toHaveBeenCalledTimes(1);
  });
});
