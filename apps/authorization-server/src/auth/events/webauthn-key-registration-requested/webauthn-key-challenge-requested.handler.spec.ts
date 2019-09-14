import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { AuthData } from '../../../user-management/entities/auth-data/auth-data.interface';
import { WebAuthnKeyChallengeRequestedHandler } from './webauthn-key-challenge-requested.handler';
import {
  WebAuthnKeyChallengeRequestedEvent,
  WebauthnChallengeType,
} from './webauthn-key-challenge-requested.event';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';

describe('Event: WebAuthnKeyRegistrationRequestedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: WebAuthnKeyChallengeRequestedHandler;

  const mockAuthData = {
    uuid: '3a4b64a4-5d2b-41d4-8faf-dc64437363e1',
    password: 'hash$salt',
  } as AuthData;

  let authData: AuthDataService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        WebAuthnKeyChallengeRequestedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: AuthDataService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<WebAuthnKeyChallengeRequestedHandler>(
      WebAuthnKeyChallengeRequestedHandler,
    );
    authData = module.get<AuthDataService>(AuthDataService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should save AuthData using AuthDataService', async () => {
    authData.save = jest.fn(() => Promise.resolve(mockAuthData));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(
      new WebAuthnKeyChallengeRequestedEvent(
        mockAuthData,
        WebauthnChallengeType.Login,
      ),
    );
    expect(authData.save).toHaveBeenCalledTimes(1);
  });
});
