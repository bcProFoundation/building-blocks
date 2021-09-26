import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { UserAuthenticatorModifiedHandler } from './user-authenticator-modified.handler';
import { UserAuthenticatorModifiedEvent } from './user-authenticator-modified.event';
import { UserAuthenticatorService } from '../../../user-management/entities/user-authenticator/user-authenticator.service';
import { UserAuthenticator } from '../../../user-management/entities/user-authenticator/user-authenticator.interface';

describe('Event: UserAuthenticatorRemovedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: UserAuthenticatorModifiedHandler;
  let authenticator: UserAuthenticatorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UserAuthenticatorModifiedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: UserAuthenticatorService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<UserAuthenticatorModifiedHandler>(
      UserAuthenticatorModifiedHandler,
    );
    authenticator = module.get<UserAuthenticatorService>(
      UserAuthenticatorService,
    );
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should remove UserAuthenticator using UserAuthenticatorService', async () => {
    authenticator.save = jest.fn(() =>
      Promise.resolve({} as UserAuthenticator & { _id: any }),
    );
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(
      new UserAuthenticatorModifiedEvent({} as UserAuthenticator),
    );
    expect(authenticator.save).toHaveBeenCalledTimes(1);
  });
});
