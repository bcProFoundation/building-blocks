import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { UserAccountAddedHandler } from './user-account-added.handler';
import { AuthData } from '../../../user-management/entities/auth-data/auth-data.interface';
import { User } from '../../../user-management/entities/user/user.interface';
import { UserAccountAddedEvent } from './user-account-added.event';
import { UserService } from '../../entities/user/user.service';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';

describe('Event: UserAccountAddedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: UserAccountAddedHandler;

  const mockAuthData = {
    uuid: '3a4b64a4-5d2b-41d4-8faf-dc64437363e1',
    password: 'hash$salt',
  } as AuthData;

  const mockUser = {
    disabled: false,
    roles: ['administrator'],
    enable2fa: false,
    otpPeriod: 30,
    deleted: false,
    uuid: '62843fea-1e30-4b1f-af91-3ff582ff9948',
    creation: new Date(),
    name: 'Test User',
    email: 'test@user.com',
    phone: '+919876543210',
    password: '15a13723-6cf0-4b25-ba41-b43cd6fc1b36',
    twoFactorTempSecret: null,
    sharedSecret: null,
  } as User;

  let authDataService: AuthDataService;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UserAccountAddedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: UserService,
          useFactory: () => jest.fn(),
        },
        {
          provide: AuthDataService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<UserAccountAddedHandler>(UserAccountAddedHandler);
    userService = module.get<UserService>(UserService);
    authDataService = module.get<AuthDataService>(AuthDataService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save AuthData and User using UserService and AuthDataService', async () => {
    authDataService.save = jest.fn(() =>
      Promise.resolve(mockAuthData as AuthData & { _id: any }),
    );
    userService.save = jest.fn(() =>
      Promise.resolve(mockUser as User & { _id: any }),
    );
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(
      new UserAccountAddedEvent(mockUser, mockAuthData),
    );
    expect(authDataService.save).toHaveBeenCalledTimes(1);
    expect(userService.save).toHaveBeenCalledTimes(1);
  });
});
