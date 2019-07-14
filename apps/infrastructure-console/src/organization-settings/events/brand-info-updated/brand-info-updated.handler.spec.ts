import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { BrandInfoUpdatedHandler } from './brand-info-updated.handler';
import { BrandInfoUpdatedEvent } from './brand-info-updated.event';
import { BrandSettings } from '../../entities/brand-settings/brand-settings.entity';

describe('Event: PasswordChangedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: BrandInfoUpdatedHandler;
  const brandSettings = new BrandSettings();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        BrandInfoUpdatedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<BrandInfoUpdatedHandler>(BrandInfoUpdatedHandler);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save AuthData using Mongoose', async () => {
    brandSettings.save = jest.fn(() => Promise.resolve(brandSettings));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new BrandInfoUpdatedEvent(brandSettings));
    expect(brandSettings.save).toHaveBeenCalledTimes(1);
  });
});
