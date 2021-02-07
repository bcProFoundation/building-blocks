import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { User } from '../../entities/user/user.interface';
import { EmailVerifiedAndUpdatedHandler } from './email-verified-and-updated.handler';
import { UserAggregateService } from '../../aggregates/user-aggregate/user-aggregate.service';
import { AuthData } from '../../entities/auth-data/auth-data.interface';
import { UserService } from '../../entities/user/user.service';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';
import { EmailVerifiedAndUpdatedEvent } from './email-verified-and-updated.event';

describe('Event: EmailVerifiedAndUpdatedHandler', () => {
  let eventBus$: EventBus;
  let manager: UserAggregateService;
  let eventHandler: EmailVerifiedAndUpdatedHandler;

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

  const mockAuthData = {
    uuid: '3a4b64a4-5d2b-41d4-8faf-dc64437363e1',
    password: 'hash$salt',
  } as AuthData;

  let userService: UserService;
  let authDataService: AuthDataService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        EmailVerifiedAndUpdatedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: UserAggregateService,
          useFactory: () => jest.fn(),
        },
        {
          provide: AuthDataService,
          useFactory: () => jest.fn(),
        },
        {
          provide: UserService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    manager = module.get<UserAggregateService>(UserAggregateService);
    eventHandler = module.get<EmailVerifiedAndUpdatedHandler>(
      EmailVerifiedAndUpdatedHandler,
    );

    userService = module.get<UserService>(UserService);
    authDataService = module.get<AuthDataService>(AuthDataService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save User with UserService and AuthData with AuthDataService', async () => {
    userService.update = jest.fn(() => Promise.resolve(mockUser));
    authDataService.remove = jest.fn(() => Promise.resolve(mockAuthData));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(
      new EmailVerifiedAndUpdatedEvent(mockUser, mockAuthData, mockAuthData),
    );
    expect(userService.update).toHaveBeenCalledTimes(1);
    expect(authDataService.remove).toHaveBeenCalledTimes(1);
  });
});
