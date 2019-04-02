import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { UserDeleteRequestService } from '../../schedulers/user-delete-request/user-delete-request.service';
import { UserAccountRemovedHandler } from './user-account-removed.handler';
import { User } from '../../entities/user/user.interface';
import { UserAccountRemovedEvent } from './user-account-removed';
import { AuthData } from '../../entities/auth-data/auth-data.interface';

describe('Event: UserAccountRemovedHandler', () => {
  let eventBus$: EventBus;
  let manager: UserDeleteRequestService;
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
          provide: UserDeleteRequestService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    manager = module.get<UserDeleteRequestService>(UserDeleteRequestService);
    eventHandler = module.get<UserAccountRemovedHandler>(
      UserAccountRemovedHandler,
    );
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should inform client the User is deleted using the UserDeleteRequestService', async () => {
    manager.informClients = jest.fn(() =>
      Promise.resolve({ id: 420, data: {} }),
    );
    mockUser.remove = jest.fn(() => Promise.resolve(mockUser));
    password.remove = jest.fn(() => Promise.resolve(password));
    sharedSecret.remove = jest.fn(() => Promise.resolve(sharedSecret));
    otpCounter.remove = jest.fn(() => Promise.resolve(otpCounter));
    twoFactorTempSecret.remove = jest.fn(() =>
      Promise.resolve(twoFactorTempSecret),
    );

    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(
      new UserAccountRemovedEvent(
        mockUser.uuid,
        mockUser,
        password,
        sharedSecret,
        otpCounter,
        twoFactorTempSecret,
      ),
    );
    expect(manager.informClients).toHaveBeenCalledTimes(1);
  });
});