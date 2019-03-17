import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { UserDeleteRequestService } from '../../schedulers/user-delete-request/user-delete-request.service';
import { UserAccountRemovedHandler } from './user-account-removed.handler';
import { User } from '../../../user-management/entities/user/user.interface';
import { UserAccountRemovedEvent } from './user-account-removed';

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
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(
      new UserAccountRemovedEvent(mockUser, mockUser.uuid),
    );
    expect(manager.informClients).toHaveBeenCalledTimes(1);
  });
});
