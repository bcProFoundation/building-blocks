import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { RemoveUserAuthenticatorHandler } from './remove-user-authenticator.handler';
import { RemoveUserAuthenticatorCommand } from './remove-user-authenticator.command';
import { WebAuthnAggregateService } from '../../aggregates/webauthn-aggregate/webauthn-aggregate.service';

describe('Command: RemoveUserAuthenticatorHandler', () => {
  let commandBus$: CommandBus;
  let manager: WebAuthnAggregateService;
  let commandHandler: RemoveUserAuthenticatorHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        RemoveUserAuthenticatorHandler,
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
    commandHandler = module.get<RemoveUserAuthenticatorHandler>(
      RemoveUserAuthenticatorHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should remove Authenticator using the WebAuthnAggregateService', async () => {
    const removeAuthenticator = jest.fn(() => Promise.resolve());
    manager.removeAuthenticator = removeAuthenticator;
    commandBus$.execute = jest.fn(() => Promise.resolve());
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      removeAuthenticator,
    }));
    await commandHandler.execute(
      new RemoveUserAuthenticatorCommand('uuid', 'actorUuid', 'userUuid'),
    );
    expect(manager.removeAuthenticator).toHaveBeenCalledTimes(1);
  });
});
