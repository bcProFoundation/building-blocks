import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { UnverifiedEmailAddedHandler } from './unverified-email-added.handler';
import { UnverifiedEmailAddedEvent } from './unverified-email-added.event';
import { User } from '../../../user-management/entities/user/user.interface';
import { AuthData } from '../../../user-management/entities/auth-data/auth-data.interface';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { EmailRequestService } from '../../../user-management/aggregates/email-request/email-request.service';

describe('Event: UnverifiedEmailAddedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: UnverifiedEmailAddedHandler;
  let authData: AuthDataService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, HttpModule],
      providers: [
        UnverifiedEmailAddedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        { provide: AuthDataService, useValue: {} },
        { provide: EmailRequestService, useValue: {} },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<UnverifiedEmailAddedHandler>(
      UnverifiedEmailAddedHandler,
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
      new UnverifiedEmailAddedEvent({} as User, {} as AuthData),
    );
    expect(authData.save).toHaveBeenCalledTimes(2);
  });
});
