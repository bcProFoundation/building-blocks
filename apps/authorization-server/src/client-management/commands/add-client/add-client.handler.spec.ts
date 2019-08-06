import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { AddClientHandler } from './add-client.handler';
import { ClientManagementAggregateService } from '../../aggregates';
import { AddClientCommand } from './add-client.command';
import { CreateClientDto } from '../../entities/client/create-client.dto';
import { Client } from '../../entities/client/client.interface';

describe('Command: AddClientHandler', () => {
  let commandBus$: CommandBus;
  let manager: ClientManagementAggregateService;
  let commandHandler: AddClientHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        AddClientHandler,
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
    commandHandler = module.get<AddClientHandler>(AddClientHandler);
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should add client using the ClientManagementAggregateService', async () => {
    manager.addClient = jest.fn(() => Promise.resolve({} as Client));
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      addClient: manager.addClient,
    }));
    await commandHandler.execute(
      new AddClientCommand(
        'e2dfbffb-df50-406d-bb80-a554a9afedec',
        {} as CreateClientDto,
      ),
    );
    expect(manager.addClient).toHaveBeenCalledTimes(1);
  });
});
