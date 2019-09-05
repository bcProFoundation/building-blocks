import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { User } from '../../entities/user/user.interface';
import { UserAccountModifiedHandler } from './user-account-modified.handler';
import { UserAccountModifiedEvent } from './user-account-modified.event';
import { UserService } from '../../entities/user/user.service';

describe('Event: UserAccountModifiedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: UserAccountModifiedHandler;

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

  let user: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UserAccountModifiedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: UserService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<UserAccountModifiedHandler>(
      UserAccountModifiedHandler,
    );
    user = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save modified User using UserService', async () => {
    user.update = jest.fn(() => Promise.resolve(mockUser));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new UserAccountModifiedEvent(mockUser));
    expect(user.update).toHaveBeenCalledTimes(1);
  });
});
