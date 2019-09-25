import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/common';
import { PhoneVerifiedHandler } from './phone-verified.handler';
import { PhoneVerifiedEvent } from './phone-verified.event';
import { User } from '../../../user-management/entities/user/user.interface';
import { AuthData } from '../../../user-management/entities/auth-data/auth-data.interface';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { UserService } from '../../../user-management/entities/user/user.service';

describe('Event: UnverifiedPhoneAddedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: PhoneVerifiedHandler;
  let user: UserService;
  let authData: AuthDataService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, HttpModule],
      providers: [
        PhoneVerifiedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        { provide: AuthDataService, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<PhoneVerifiedHandler>(PhoneVerifiedHandler);
    authData = module.get<AuthDataService>(AuthDataService);
    user = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save User and remove phoneOTP using IO Services', async () => {
    authData.remove = jest.fn(() => Promise.resolve({} as AuthData));
    user.save = jest.fn(() => Promise.resolve({} as User));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(
      new PhoneVerifiedEvent({} as User, {} as AuthData),
    );
    expect(user.save).toHaveBeenCalledTimes(1);
    expect(authData.remove).toHaveBeenCalledTimes(1);
  });
});
