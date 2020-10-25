import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';
import { WebAuthnRequestLoginHandler } from './webauthn-request-login.handler';
import { WebAuthnRequestLoginCommand } from './webauthn-request-login.command';
import { WebAuthnAggregateService } from '../../aggregates/webauthn-aggregate/webauthn-aggregate.service';

describe('Command: RequestWebAuthnKeyRegistrationHandler', () => {
  let commandBus$: CommandBus;
  let manager: WebAuthnAggregateService;
  let commandHandler: WebAuthnRequestLoginHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        WebAuthnRequestLoginHandler,
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: WebAuthnAggregateService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    commandBus$ = module.get<CommandBus>(CommandBus);
    manager = module.get<WebAuthnAggregateService>(WebAuthnAggregateService);
    commandHandler = module.get<WebAuthnRequestLoginHandler>(
      WebAuthnRequestLoginHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should generate login challenge WebAuthnAggregateService', async () => {
    const login = jest.fn(() =>
      Promise.resolve({} as PublicKeyCredentialRequestOptionsJSON),
    );
    manager.login = login;
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      login,
    }));
    await commandHandler.execute(
      new WebAuthnRequestLoginCommand('emailOrPhone'),
    );
    expect(manager.login).toHaveBeenCalledTimes(1);
  });
});
