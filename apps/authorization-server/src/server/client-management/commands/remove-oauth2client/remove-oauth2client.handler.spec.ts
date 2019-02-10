import { Test } from '@nestjs/testing';
import { CommandBus, CQRSModule, EventPublisher } from '@nestjs/cqrs';
import { ClientManagementAggregateService } from '../../../client-management/aggregates';
import { RemoveOAuth2ClientHandler } from './remove-oauth2client.handler';
import { Client } from '../../../client-management/entities/client/client.interface';
import { RemoveOAuth2ClientCommand } from './remove-oauth2client.command';

describe('Command: RemoveOAuth2ClientHandler', () => {
  let commandBus$: CommandBus;
  let manager: ClientManagementAggregateService;
  let commandHandler: RemoveOAuth2ClientHandler;
  let publisher: EventPublisher;

  const mockClient = {
    redirectUris: [],
    allowedScopes: ['roles'],
    name: 'booom',
    isTrusted: 0,
    createdBy: 'add0d2e8-fc16-4671-8893-88254b321840',
    modifiedBy: 'add0d2e8-fc16-4671-8893-88254b321840',
    creation: new Date(),
    modified: new Date(),
    uuid: 'a8a591e7-ddc2-4c2a-afef-84ca3ab722cc',
    clientId: '6d9033b9-b7ba-4218-b430-44e470d69b12',
    clientSecret:
      '6893166b3a34d142597de9826154cb9845d92620ca4d88f1bbc8227136c43228',
  } as Client;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CQRSModule],
      providers: [
        RemoveOAuth2ClientHandler,
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
    commandHandler = module.get<RemoveOAuth2ClientHandler>(
      RemoveOAuth2ClientHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should remove client using the ClientManagementAggregateService', async () => {
    manager.removeClient = jest.fn(() => Promise.resolve());
    commandBus$.execute = jest.fn(() => {});
    publisher.mergeObjectContext = jest.fn(aggregate => ({
      commit: () => {},
    }));
    await commandHandler.execute(
      new RemoveOAuth2ClientCommand(
        'add0d2e8-fc16-4671-8893-88254b321840',
        mockClient.clientId,
      ),
      (...args) => {},
    );
    expect(manager.removeClient).toHaveBeenCalledTimes(1);
  });
});
