import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { UnverifiedPhoneAddedHandler } from './unverified-phone-added.handler';
import { UnverifiedPhoneAddedEvent } from './unverified-phone-added.event';
import { User } from '../../../user-management/entities/user/user.interface';
import { AuthData } from '../../../user-management/entities/auth-data/auth-data.interface';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';

describe('Event: UnverifiedPhoneAddedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: UnverifiedPhoneAddedHandler;
  let authData: AuthDataService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, HttpModule],
      providers: [
        UnverifiedPhoneAddedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        { provide: AuthDataService, useValue: {} },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<UnverifiedPhoneAddedHandler>(
      UnverifiedPhoneAddedHandler,
    );
    authData = module.get<AuthDataService>(AuthDataService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save phoneOTP using AuthDataService', async () => {
    authData.save = jest.fn(() =>
      Promise.resolve({} as AuthData & { _id: any }),
    );
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(
      new UnverifiedPhoneAddedEvent({} as User, {} as AuthData, '420710'),
    );
    expect(authData.save).toHaveBeenCalledTimes(1);
  });
});
