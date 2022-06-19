import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { DeleteResult } from 'mongodb';
import { UserAccountRemovedHandler } from './user-account-removed.handler';
import { User } from '../../entities/user/user.interface';
import { UserAccountRemovedEvent } from './user-account-removed';
import { AuthData } from '../../entities/auth-data/auth-data.interface';
import { UserService } from '../../entities/user/user.service';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';
import { UserClaimService } from '../../../auth/entities/user-claim/user-claim.service';

describe('Event: UserAccountRemovedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: UserAccountRemovedHandler;

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

  const password = {
    uuid: '3a4b64a4-5d2b-41d4-8faf-dc64437363e1',
    password: 'hash$salt',
  } as AuthData;

  const sharedSecret = {
    uuid: '3a4b64a4-5d2b-41d4-8faf-dc64437363e1',
    password: 'hash$salt',
  } as AuthData;

  const otpCounter = {
    uuid: '3a4b64a4-5d2b-41d4-8faf-dc64437363e1',
    password: 'hash$salt',
  } as AuthData;

  const twoFactorTempSecret = {
    uuid: '3a4b64a4-5d2b-41d4-8faf-dc64437363e1',
    password: 'hash$salt',
  } as AuthData;

  let userService: UserService;
  let authDataService: AuthDataService;
  let userClaimService: UserClaimService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UserAccountRemovedHandler,
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
        {
          provide: UserClaimService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<UserAccountRemovedHandler>(
      UserAccountRemovedHandler,
    );
    userService = module.get<UserService>(UserService);
    authDataService = module.get<AuthDataService>(AuthDataService);
    userClaimService = module.get<UserClaimService>(UserClaimService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should inform client the User is deleted using the UserDeleteRequestService', async () => {
    userService.remove = jest.fn(() => Promise.resolve({} as User));
    authDataService.remove = jest.fn(() => Promise.resolve({} as AuthData));
    authDataService.deleteMany = jest.fn(() =>
      Promise.resolve({} as DeleteResult),
    );
    userClaimService.deleteMany = jest.fn(() =>
      Promise.resolve({} as DeleteResult),
    );
    eventBus$.publish = jest.fn(() => {});

    await eventHandler.handle(
      new UserAccountRemovedEvent(
        mockUser,
        password,
        sharedSecret,
        otpCounter,
        twoFactorTempSecret,
      ),
    );
    expect(userService.remove).toHaveBeenCalledTimes(1);
  });
});
