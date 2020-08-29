import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { ClientManagementAggregateService } from '../../aggregates';
import { CreateClientDto } from '../../entities/client/create-client.dto';
import { ModifyClientCommand } from './modify-client.command';
import { ModifyClientHandler } from './modify-client.handler';
import { Client } from '../../entities/client/client.interface';

describe('Command: ModifyClientHandler', () => {
  let commandBus$: CommandBus;
  let manager: ClientManagementAggregateService;
  let commandHandler: ModifyClientHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ModifyClientHandler,
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
    commandHandler = module.get<ModifyClientHandler>(ModifyClientHandler);
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should modify client using the ClientManagementAggregateService', async () => {
    manager.modifyClient = jest.fn(() => Promise.resolve({} as Client));
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      modifyClient: manager.modifyClient,
    }));
    await commandHandler.execute(
      new ModifyClientCommand(
        'e2dfbffb-df50-406d-bb80-a554a9afedec',
        '94464982-0fd5-4ad1-8c9a-340b9444b62e',
        {} as CreateClientDto,
      ),
    );
    expect(manager.modifyClient).toHaveBeenCalledTimes(1);
  });
});
