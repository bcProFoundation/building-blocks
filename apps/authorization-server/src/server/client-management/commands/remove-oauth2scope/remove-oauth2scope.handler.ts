import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveOAuth2ScopeCommand } from './remove-oauth2scope.command';
import { ClientManagementAggregateService } from '../../../client-management/aggregates';

@CommandHandler(RemoveOAuth2ScopeCommand)
export class RemoveOAuth2ScopeHandler
  implements ICommandHandler<RemoveOAuth2ScopeCommand> {
  constructor(
    private readonly manager: ClientManagementAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveOAuth2ScopeCommand) {
    const { actorUserUuid, scopeName } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.removeScope(scopeName, actorUserUuid);
    aggregate.commit();
  }
}
