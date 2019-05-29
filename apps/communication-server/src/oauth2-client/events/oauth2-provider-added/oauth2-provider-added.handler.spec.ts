import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { OAuth2ProviderAddedHandler } from './oauth2-provider-added.handler';
import { OAuth2ProviderAddedEvent } from './oauth2-provider-added.event';
import { OAuth2Provider } from '../../entities/oauth2-provider/oauth2-provider.entity';

describe('Event: OAuth2ProviderAddedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: OAuth2ProviderAddedHandler;
  const mockProvider = new OAuth2Provider();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        OAuth2ProviderAddedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<OAuth2ProviderAddedHandler>(
      OAuth2ProviderAddedHandler,
    );
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save OAuth2Provider', async () => {
    eventBus$.publish = jest.fn(() => {});
    mockProvider.save = jest.fn(() => Promise.resolve(mockProvider));
    await eventHandler.handle(new OAuth2ProviderAddedEvent(mockProvider));
    expect(mockProvider.save).toHaveBeenCalledTimes(1);
  });
});
