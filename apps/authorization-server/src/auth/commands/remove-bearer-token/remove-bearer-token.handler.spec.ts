import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { RemoveBearerTokenHandler } from './remove-bearer-token.handler';
import { BearerTokenManagerService } from '../../aggregates/bearer-token-manager/bearer-token-manager.service';
import { RemoveBearerTokenCommand } from './remove-bearer-token.command';

describe('Command: RemoveBearerTokenHandler', () => {
  let commandBus$: CommandBus;
  let manager: BearerTokenManagerService;
  let commandHandler: RemoveBearerTokenHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        RemoveBearerTokenHandler,
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: BearerTokenManagerService,
          useValue: {
            removeToken: jest.fn(() => Promise.resolve({ message: '1' })),
          },
        },
      ],
    }).compile();

    commandBus$ = module.get<CommandBus>(CommandBus);
    manager = module.get<BearerTokenManagerService>(BearerTokenManagerService);
    commandHandler = module.get<RemoveBearerTokenHandler>(
      RemoveBearerTokenHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should remove token using the BearerTokenManagerService', async () => {
    const message = 'success';
    manager.removeToken = jest.fn(() => Promise.resolve({ message }));
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      removeToken: manager.removeToken,
    }));
    await commandHandler.execute(new RemoveBearerTokenCommand('mockToken'));
    expect(manager.removeToken).toHaveBeenCalledTimes(1);
  });
});
