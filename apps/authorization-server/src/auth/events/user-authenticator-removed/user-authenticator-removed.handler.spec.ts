import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { UserAuthenticatorRemovedHandler } from './user-authenticator-removed.handler';
import { UserAuthenticatorRemovedEvent } from './user-authenticator-removed.event';
import { UserAuthenticatorService } from '../../../user-management/entities/user-authenticator/user-authenticator.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { UserAuthenticator } from '../../../user-management/entities/user-authenticator/user-authenticator.interface';

describe('Event: UserAuthenticatorRemovedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: UserAuthenticatorRemovedHandler;
  let authenticator: UserAuthenticatorService;
  let authData: AuthDataService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UserAuthenticatorRemovedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: UserAuthenticatorService,
          useFactory: () => jest.fn(),
        },
        {
          provide: AuthDataService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<UserAuthenticatorRemovedHandler>(
      UserAuthenticatorRemovedHandler,
    );
    authenticator = module.get<UserAuthenticatorService>(
      UserAuthenticatorService,
    );
    authData = module.get<AuthDataService>(AuthDataService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should remove UserAuthenticator using UserAuthenticatorService', async () => {
    authenticator.remove = jest.fn(() =>
      Promise.resolve({} as UserAuthenticator),
    );
    authData.deleteMany = jest.fn(() => Promise.resolve({}));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(
      new UserAuthenticatorRemovedEvent({} as UserAuthenticator),
    );
    expect(authenticator.remove).toHaveBeenCalledTimes(1);
    expect(authData.deleteMany).toHaveBeenCalledTimes(1);
  });
});
