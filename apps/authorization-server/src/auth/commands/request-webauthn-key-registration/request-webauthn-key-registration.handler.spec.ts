import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { RequestWebAuthnKeyRegistrationHandler } from './request-webauthn-key-registration.handler';
import { RequestWebAuthnKeyRegistrationCommand } from './request-webauthn-key-registration.command';
import { WebAuthnAggregateService } from '../../aggregates/webauthn-aggregate/webauthn-aggregate.service';

describe('Command: RequestWebAuthnKeyRegistrationHandler', () => {
  let commandBus$: CommandBus;
  let manager: WebAuthnAggregateService;
  let commandHandler: RequestWebAuthnKeyRegistrationHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        RequestWebAuthnKeyRegistrationHandler,
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
    commandHandler = module.get<RequestWebAuthnKeyRegistrationHandler>(
      RequestWebAuthnKeyRegistrationHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should generate registration challenge using the WebAuthnAggregateService', async () => {
    const requestRegister = jest.fn((...args) => Promise.resolve({} as any));
    manager.requestRegister = requestRegister;
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      requestRegister,
    }));
    await commandHandler.execute(
      new RequestWebAuthnKeyRegistrationCommand('actorUuid', 'userUuid'),
    );
    expect(manager.requestRegister).toHaveBeenCalledTimes(1);
  });
});
