import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { OAuth2Provider } from '../../entities/oauth2-provider/oauth2-provider.entity';
import { OAuth2ProviderUpdatedHandler } from './oauth2-provider-updated.handler';
import { OAuth2ProviderUpdatedEvent } from './oauth2-provider-updated.event';

describe('Event: OAuth2ProviderUpdatedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: OAuth2ProviderUpdatedHandler;
  const mockProvider = new OAuth2Provider();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        OAuth2ProviderUpdatedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<OAuth2ProviderUpdatedHandler>(
      OAuth2ProviderUpdatedHandler,
    );
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save OAuth2Provider', async () => {
    eventBus$.publish = jest.fn(() => {});
    mockProvider.save = jest.fn(() => Promise.resolve(mockProvider));
    await eventHandler.handle(new OAuth2ProviderUpdatedEvent(mockProvider));
    expect(mockProvider.save).toHaveBeenCalledTimes(1);
  });
});
