import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { BearerTokensDeletedHandler } from './bearer-tokens-deleted.handler';
import { BearerTokensDeletedEvent } from './bearer-tokens-deleted.event';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';

describe('Event: BearerTokensDeletedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: BearerTokensDeletedHandler;
  let bearerTokenService: BearerTokenService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        BearerTokensDeletedHandler,
        { provide: BearerTokenService, useValue: {} },
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<BearerTokensDeletedHandler>(
      BearerTokensDeletedHandler,
    );
    bearerTokenService = module.get<BearerTokenService>(BearerTokenService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should clear tokens using Mongoose', async () => {
    eventBus$.publish = jest.fn(() => {});
    bearerTokenService.clear = jest.fn(() => Promise.resolve({ ok: 420 }));
    await eventHandler.handle(new BearerTokensDeletedEvent('uuid-here'));
    expect(bearerTokenService.clear).toHaveBeenCalledTimes(1);
  });
});
