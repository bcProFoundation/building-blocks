import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { ClientManagementAggregateService } from '../../aggregates';
import { UpdateClientSecretCommand } from './update-client-secret.command';
import { UpdateClientSecretHandler } from './update-client-secret.handler';
import { Client } from 'client-management/entities/client/client.interface';

describe('Command: UpdateClientSecretHandler', () => {
  let commandBus$: CommandBus;
  let manager: ClientManagementAggregateService;
  let commandHandler: UpdateClientSecretHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UpdateClientSecretHandler,
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
    commandHandler = module.get<UpdateClientSecretHandler>(
      UpdateClientSecretHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should modify client using the ClientManagementAggregateService', async () => {
    manager.updateClientSecret = jest.fn(() => Promise.resolve({} as Client));
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      updateClientSecret: manager.updateClientSecret,
    }));
    await commandHandler.execute(
      new UpdateClientSecretCommand(
        'e2dfbffb-df50-406d-bb80-a554a9afedec',
        '94464982-0fd5-4ad1-8c9a-340b9444b62e',
      ),
    );
    expect(manager.updateClientSecret).toHaveBeenCalledTimes(1);
  });
});
