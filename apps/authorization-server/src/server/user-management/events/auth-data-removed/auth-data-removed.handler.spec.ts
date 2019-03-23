import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { AuthData } from '../../entities/auth-data/auth-data.interface';
import { AuthDataRemovedHandler } from './auth-data-removed.handler';
import { AuthDataRemovedEvent } from './auth-data-removed.event';

describe('Event: AuthDataRemovedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: AuthDataRemovedHandler;

  const mockAuthData = {
    uuid: '3a4b64a4-5d2b-41d4-8faf-dc64437363e1',
    password: 'hash$salt',
  } as AuthData;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        AuthDataRemovedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<AuthDataRemovedHandler>(AuthDataRemovedHandler);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should remove AuthData using Mongoose', async () => {
    mockAuthData.remove = jest.fn(() => Promise.resolve(mockAuthData));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new AuthDataRemovedEvent(mockAuthData));
    expect(mockAuthData.remove).toHaveBeenCalledTimes(1);
  });
});
