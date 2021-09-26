import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { AuthData } from '../../entities/auth-data/auth-data.interface';
import { PasswordChangedHandler } from './password-changed.handler';
import { PasswordChangedEvent } from './password-changed.event';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';

describe('Event: PasswordChangedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: PasswordChangedHandler;

  const mockAuthData = {
    uuid: '3a4b64a4-5d2b-41d4-8faf-dc64437363e1',
    password: 'hash$salt',
  } as AuthData;

  let authData: AuthDataService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        PasswordChangedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: AuthDataService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<PasswordChangedHandler>(PasswordChangedHandler);
    authData = module.get<AuthDataService>(AuthDataService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save AuthData using AuthDataService', async () => {
    authData.save = jest.fn(() =>
      Promise.resolve(mockAuthData as AuthData & { _id: any }),
    );
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new PasswordChangedEvent(mockAuthData));
    expect(authData.save).toHaveBeenCalledTimes(1);
  });
});
