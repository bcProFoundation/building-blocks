import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { ClientManagementAggregateService } from '../../aggregates';
import { RemoveOAuth2ScopeHandler } from './remove-oauth2scope.handler';
import { RemoveOAuth2ScopeCommand } from './remove-oauth2scope.command';
import { Scope } from '../../../client-management/entities/scope/scope.interface';

describe('Command: RemoveOAuth2ScopeHandler', () => {
  let commandBus$: CommandBus;
  let manager: ClientManagementAggregateService;
  let commandHandler: RemoveOAuth2ScopeHandler;
  let publisher: EventPublisher;

  const mockScope = {
    name: 'booom',
    description: 'test-scope',
  } as Scope;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        RemoveOAuth2ScopeHandler,
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
    commandHandler = module.get<RemoveOAuth2ScopeHandler>(
      RemoveOAuth2ScopeHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should remove scope using the ClientManagementAggregateService', async () => {
    manager.removeScope = jest.fn(() => Promise.resolve());
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest
      .fn()
      .mockImplementation((...args) => ({ commit: () => {} }));
    await commandHandler.execute(
      new RemoveOAuth2ScopeCommand(
        'add0d2e8-fc16-4671-8893-88254b321840',
        mockScope.name,
      ),
    );
    expect(manager.removeScope).toHaveBeenCalledTimes(1);
  });
});
