import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { UserAccountAddedHandler } from './user-account-added.handler';
import { AuthData } from 'server/user-management/entities/auth-data/auth-data.interface';
import { User } from 'server/user-management/entities/user/user.interface';
import { UserAccountAddedEvent } from './user-account-added.event';

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

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UserAccountAddedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<UserAccountAddedHandler>(UserAccountAddedHandler);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save AuthData and User using Mongoose', async () => {
    mockAuthData.save = jest.fn(() => Promise.resolve(mockAuthData));
    mockUser.save = jest.fn(() => Promise.resolve(mockUser));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(
      new UserAccountAddedEvent(mockUser, mockAuthData),
    );
    expect(mockAuthData.save).toHaveBeenCalledTimes(1);
    expect(mockUser.save).toHaveBeenCalledTimes(1);
  });
});
