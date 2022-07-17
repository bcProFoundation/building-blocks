import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { BearerToken } from '../../entities/bearer-token/bearer-token.interface';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';
import { BearerTokenAddedHandler } from './bearer-token-added.handler';
import { BearerTokenAddedEvent } from './bearer-token-added.event';

describe('Event: BearerTokenAddedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: BearerTokenAddedHandler;
  let token: BearerTokenService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, HttpModule],
      providers: [
        BearerTokenAddedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        { provide: BearerTokenService, useValue: {} },
        { provide: ClientService, useValue: {} },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<BearerTokenAddedHandler>(BearerTokenAddedHandler);
    token = module.get<BearerTokenService>(BearerTokenService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should add BearerToken using BearerTokenService', async () => {
    token.save = jest.fn(() =>
      Promise.resolve({} as BearerToken & { _id: any }),
    );
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new BearerTokenAddedEvent({} as BearerToken));
    expect(token.save).toHaveBeenCalledTimes(1);
  });
});
