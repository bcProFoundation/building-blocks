import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { WebAuthnLoginHandler } from './webauthn-login.handler';
import { WebAuthnLoginCommand } from './webauthn-login.command';
import { WebAuthnAggregateService } from '../../aggregates/webauthn-aggregate/webauthn-aggregate.service';
import { Request } from 'express';

describe('Command: WebAuthnLoginHandler', () => {
  let commandBus$: CommandBus;
  let manager: WebAuthnAggregateService;
  let commandHandler: WebAuthnLoginHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        WebAuthnLoginHandler,
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
    commandHandler = module.get<WebAuthnLoginHandler>(WebAuthnLoginHandler);
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should generate login challenge WebAuthnAggregateService', async () => {
    const loginChallenge = jest.fn(() =>
      Promise.resolve({
        verified: true,
        redirect: 'redirectUrl',
      }),
    );
    manager.loginChallenge = loginChallenge;
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      loginChallenge,
    }));
    await commandHandler.execute(new WebAuthnLoginCommand({} as Request));
    expect(manager.loginChallenge).toHaveBeenCalledTimes(1);
  });
});
