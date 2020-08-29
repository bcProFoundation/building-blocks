import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { ClientManagementAggregateService } from '../../aggregates';
import { AddOAuth2ScopeHandler } from './add-oauth2scope.handler';
import { AddOAuth2ScopeCommand } from './add-oauth2scope.command';
import { CreateScopeDto } from '../../../user-management/policies';
import { Scope } from '../../entities/scope/scope.interface';

describe('Command: AddOAuth2ScopeHandler', () => {
  let commandBus$: CommandBus;
  let manager: ClientManagementAggregateService;
  let commandHandler: AddOAuth2ScopeHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        AddOAuth2ScopeHandler,
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
    commandHandler = module.get<AddOAuth2ScopeHandler>(AddOAuth2ScopeHandler);
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should remove scope using the ClientManagementAggregateService', async () => {
    manager.addScope = jest.fn((...args) => Promise.resolve({} as Scope));
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      addScope: manager.addScope,
    }));
    await commandHandler.execute(
      new AddOAuth2ScopeCommand('actorUuid', {} as CreateScopeDto),
    );
    expect(manager.addScope).toHaveBeenCalledTimes(1);
  });
});
