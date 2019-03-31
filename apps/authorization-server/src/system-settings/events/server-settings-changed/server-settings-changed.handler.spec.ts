import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { SystemSettingsChangedHandler } from './server-settings-changed.handler';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.interface';
import { SystemSettingsChangedEvent } from './server-settings-changed.event';

describe('Event: SystemSettingsChangedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: SystemSettingsChangedHandler;

  const mockServerSettings = {
    issuerUrl: 'http://accounts.localhost:3000',
    infrastructureConsoleClientId: 'cfeb8ebb-716c-4f21-8c3f-b15eb61cdbce',
    uuid: 'd85b9d83-7008-4d31-93e3-fcb8e6ca2c67',
    communicationServerClientId: 'c95d2a1c-e185-491f-b7b7-55476524a01a',
  } as ServerSettings;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        SystemSettingsChangedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<SystemSettingsChangedHandler>(
      SystemSettingsChangedHandler,
    );
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save AuthData using Mongoose', async () => {
    mockServerSettings.save = jest.fn(() =>
      Promise.resolve(mockServerSettings),
    );
    eventBus$.publish = jest.fn(() => {});
    const actorUserUuid = '5e86afd6-7058-408b-b856-2ecfc9d91fb7';
    await eventHandler.handle(
      new SystemSettingsChangedEvent(actorUserUuid, mockServerSettings),
    );
    expect(mockServerSettings.save).toHaveBeenCalledTimes(1);
  });
});
