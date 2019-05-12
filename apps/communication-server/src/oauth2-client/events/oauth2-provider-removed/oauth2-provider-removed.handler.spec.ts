import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { OAuth2Provider } from '../../entities/oauth2-provider/oauth2-provider.entity';
import { OAuth2ProviderRemovedHandler } from './oauth2-provider-removed.handler';
import { OAuth2ProviderRemovedEvent } from './oauth2-provider-removed.event';

describe('Event: OAuth2ProviderRemovedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: OAuth2ProviderRemovedHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        OAuth2ProviderRemovedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<OAuth2ProviderRemovedHandler>(
      OAuth2ProviderRemovedHandler,
    );
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should remove OAuth2Provider', async () => {
    const mockProvider = new OAuth2Provider();
    eventBus$.publish = jest.fn(() => {});
    mockProvider.remove = jest.fn(() => Promise.resolve(mockProvider));
    await eventHandler.handle(new OAuth2ProviderRemovedEvent(mockProvider));
    expect(mockProvider.remove).toHaveBeenCalledTimes(1);
  });
});
