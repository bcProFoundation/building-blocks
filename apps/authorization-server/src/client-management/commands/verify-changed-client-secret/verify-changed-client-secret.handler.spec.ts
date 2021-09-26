import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { ClientManagementAggregateService } from '../../aggregates';
import { VerifyChangedClientSecretCommand } from './verify-changed-client-secret.command';
import { VerifyChangedClientSecretHandler } from './verify-changed-client-secret.handler';
import { Client } from '../../entities/client/client.interface';

describe('Command: VerifyChangedClientSecretHandler', () => {
  let commandBus$: CommandBus;
  let manager: ClientManagementAggregateService;
  let commandHandler: VerifyChangedClientSecretHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        VerifyChangedClientSecretHandler,
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: ClientManagementAggregateService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    commandBus$ = module.get<CommandBus>(CommandBus);
    manager = module.get<ClientManagementAggregateService>(
      ClientManagementAggregateService,
    );
    commandHandler = module.get<VerifyChangedClientSecretHandler>(
      VerifyChangedClientSecretHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should modify client using the ClientManagementAggregateService', async () => {
    manager.verifyChangedSecret = jest.fn(() =>
      Promise.resolve({} as Client & { _id: any }),
    );
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      verifyChangedSecret: manager.verifyChangedSecret,
    }));
    await commandHandler.execute(
      new VerifyChangedClientSecretCommand(
        Buffer.from('admin:secret').toString('base64'),
      ),
    );
    expect(manager.verifyChangedSecret).toHaveBeenCalledTimes(1);
  });
});
