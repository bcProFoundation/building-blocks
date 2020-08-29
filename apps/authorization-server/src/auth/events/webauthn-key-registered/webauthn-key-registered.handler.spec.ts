import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { WebAuthnKeyRegisteredHandler } from './webauthn-key-registered.handler';
import { WebAuthnKeyRegisteredEvent } from './webauthn-key-registered.event';
import { UserAuthenticatorService } from '../../../user-management/entities/user-authenticator/user-authenticator.service';
import { UserAuthenticator } from '../../../user-management/entities/user-authenticator/user-authenticator.interface';

describe('Event: WebAuthnKeyRegisteredHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: WebAuthnKeyRegisteredHandler;

  const mockAuthenticator = {} as UserAuthenticator;

  let authenticator: UserAuthenticatorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        WebAuthnKeyRegisteredHandler,
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
    eventHandler = module.get<WebAuthnKeyRegisteredHandler>(
      WebAuthnKeyRegisteredHandler,
    );
    authenticator = module.get<UserAuthenticatorService>(
      UserAuthenticatorService,
    );
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save AuthData using UserAuthenticatorService', async () => {
    authenticator.save = jest.fn(() => Promise.resolve(mockAuthenticator));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(
      new WebAuthnKeyRegisteredEvent(mockAuthenticator),
    );
    expect(authenticator.save).toHaveBeenCalledTimes(1);
  });
});
