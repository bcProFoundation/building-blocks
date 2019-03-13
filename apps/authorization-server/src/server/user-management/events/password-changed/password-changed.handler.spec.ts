import { Test } from '@nestjs/testing';
import { CQRSModule, EventBus } from '@nestjs/cqrs';
import { AuthData } from '../../entities/auth-data/auth-data.interface';
import { PasswordChangedHandler } from './password-changed.handler';
import { PasswordChangedEvent } from './password-changed.event';

describe('Event: PasswordChangedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: PasswordChangedHandler;

  const mockAuthData = {
    uuid: '3a4b64a4-5d2b-41d4-8faf-dc64437363e1',
    password: 'hash$salt',
  } as AuthData;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CQRSModule],
      providers: [
        PasswordChangedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<PasswordChangedHandler>(PasswordChangedHandler);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save AuthData using Mongoose', async () => {
    mockAuthData.save = jest.fn(() => Promise.resolve(mockAuthData));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new PasswordChangedEvent(mockAuthData));
    expect(mockAuthData.save).toHaveBeenCalledTimes(1);
  });
});
