import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { RegisterWebAuthnKeyHandler } from './register-webauthn-key.handler';
import {
  RegisterWebAuthnKeyCommand,
  RequestBodyAsAny,
} from './register-webauthn-key.command';
import { WebAuthnAggregateService } from '../../aggregates/webauthn-aggregate/webauthn-aggregate.service';

describe('Command: RegisterWebAuthnKeyHandler', () => {
  let commandBus$: CommandBus;
  let manager: WebAuthnAggregateService;
  let commandHandler: RegisterWebAuthnKeyHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        RegisterWebAuthnKeyHandler,
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
    commandHandler = module.get<RegisterWebAuthnKeyHandler>(
      RegisterWebAuthnKeyHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should generate registration challenge using the WebAuthnAggregateService', async () => {
    const register = jest.fn(() =>
      Promise.resolve({ registered: 'authenticator-uuid' }),
    );
    manager.register = register;
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      register,
    }));
    await commandHandler.execute(
      new RegisterWebAuthnKeyCommand({} as RequestBodyAsAny),
    );
    expect(manager.register).toHaveBeenCalledTimes(1);
  });
});
