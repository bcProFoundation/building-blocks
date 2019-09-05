import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { ClientManagementAggregateService } from '../../aggregates';
import { ModifyOAuth2ScopeHandler } from './modify-oauth2scope.handler';
import { ModifyOAuth2ScopeCommand } from './modify-oauth2scope.command';
import { Scope } from '../../entities/scope/scope.interface';
import { CreateScopeDto } from '../../../user-management/policies';

describe('Command: ModifyOAuth2ScopeHandler', () => {
  let commandBus$: CommandBus;
  let manager: ClientManagementAggregateService;
  let commandHandler: ModifyOAuth2ScopeHandler;
  let publisher: EventPublisher;

  const mockScope = {
    name: 'booom',
    description: 'test-scope',
  } as Scope;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ModifyOAuth2ScopeHandler,
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
    commandHandler = module.get<ModifyOAuth2ScopeHandler>(
      ModifyOAuth2ScopeHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should remove scope using the ClientManagementAggregateService', async () => {
    manager.modifyScope = jest.fn((...args) => Promise.resolve(mockScope));
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      modifyScope: manager.modifyScope,
    }));
    await commandHandler.execute(
      new ModifyOAuth2ScopeCommand(
        'actorUuid',
        'scopeUuid',
        {} as CreateScopeDto,
      ),
    );
    expect(manager.modifyScope).toHaveBeenCalledTimes(1);
  });
});
