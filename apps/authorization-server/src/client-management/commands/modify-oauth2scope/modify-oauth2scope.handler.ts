import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ModifyOAuth2ScopeCommand } from './modify-oauth2scope.command';
import { ClientManagementAggregateService } from '../../aggregates';

@CommandHandler(ModifyOAuth2ScopeCommand)
export class ModifyOAuth2ScopeHandler
  implements ICommandHandler<ModifyOAuth2ScopeCommand> {
  constructor(
    private readonly manager: ClientManagementAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ModifyOAuth2ScopeCommand) {
    const { actorUserUuid, scopeUuid, payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.modifyScope(payload, actorUserUuid, scopeUuid);
    aggregate.commit();
  }
}
