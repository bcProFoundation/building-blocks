import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { BearerTokenRemovedHandler } from './bearer-token-removed.handler';
import { BearerTokenRemovedEvent } from './bearer-token-removed.event';
import { BearerToken } from '../../entities/bearer-token/bearer-token.interface';
import { HttpModule } from '@nestjs/common';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';

describe('Event: BearerTokenRemovedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: BearerTokenRemovedHandler;
  let token: BearerTokenService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, HttpModule],
      providers: [
        BearerTokenRemovedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        { provide: BearerTokenService, useValue: {} },
        { provide: ClientService, useValue: {} },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<BearerTokenRemovedHandler>(
      BearerTokenRemovedHandler,
    );
    token = module.get<BearerTokenService>(BearerTokenService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should remove BearerToken using BearerTokenService', async () => {
    token.remove = jest.fn(() => Promise.resolve({} as BearerToken));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new BearerTokenRemovedEvent({} as BearerToken));
    expect(token.remove).toHaveBeenCalledTimes(1);
  });
});
