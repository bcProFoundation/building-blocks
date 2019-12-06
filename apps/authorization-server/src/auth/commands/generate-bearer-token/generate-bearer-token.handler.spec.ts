import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { GenerateBearerTokenHandler } from './generate-bearer-token.handler';
import { GenerateBearerTokenCommand } from './generate-bearer-token.command';
import { OAuth2TokenGeneratorService } from '../../oauth2/oauth2-token-generator/oauth2-token-generator.service';
import { BearerToken } from '../../entities/bearer-token/bearer-token.interface';

describe('Command: GenerateBearerTokenHandler', () => {
  let commandBus$: CommandBus;
  let manager: OAuth2TokenGeneratorService;
  let commandHandler: GenerateBearerTokenHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        GenerateBearerTokenHandler,
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: OAuth2TokenGeneratorService,
          useValue: {
            removeToken: jest.fn(() => Promise.resolve({ message: '1' })),
          },
        },
      ],
    }).compile();

    commandBus$ = module.get<CommandBus>(CommandBus);
    manager = module.get<OAuth2TokenGeneratorService>(
      OAuth2TokenGeneratorService,
    );
    commandHandler = module.get<GenerateBearerTokenHandler>(
      GenerateBearerTokenHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should remove token using the OAuth2TokenGeneratorService', async () => {
    manager.getBearerToken = jest.fn((...args) =>
      Promise.resolve(({} as BearerToken, {} as any)),
    );
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      getBearerToken: manager.getBearerToken,
    }));
    await commandHandler.execute(
      new GenerateBearerTokenCommand('client', 'user', ['scope'], true, false),
    );
    expect(manager.getBearerToken).toHaveBeenCalledTimes(1);
  });
});
