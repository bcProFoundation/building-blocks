import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { RenameUserAuthenticatorHandler } from './rename-user-authenticator.handler';
import { RenameUserAuthenticatorCommand } from './rename-user-authenticator.command';
import { WebAuthnAggregateService } from '../../aggregates/webauthn-aggregate/webauthn-aggregate.service';

describe('Command: RemoveUserAuthenticatorHandler', () => {
  let commandBus$: CommandBus;
  let manager: WebAuthnAggregateService;
  let commandHandler: RenameUserAuthenticatorHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        RenameUserAuthenticatorHandler,
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
    commandHandler = module.get<RenameUserAuthenticatorHandler>(
      RenameUserAuthenticatorHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should rename Authenticator using the WebAuthnAggregateService', async () => {
    const renameAuthenticator = jest.fn(() =>
      Promise.resolve({ name: 'authKey.name', uuid: 'authKey.uuid' }),
    );
    manager.renameAuthenticator = renameAuthenticator;
    commandBus$.execute = jest.fn(() => Promise.resolve());
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      renameAuthenticator,
    }));
    await commandHandler.execute(
      new RenameUserAuthenticatorCommand('uuid', 'actorUuid', 'userUuid'),
    );
    expect(manager.renameAuthenticator).toHaveBeenCalledTimes(1);
  });
});
