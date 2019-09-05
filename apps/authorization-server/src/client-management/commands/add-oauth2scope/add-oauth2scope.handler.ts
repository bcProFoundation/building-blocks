import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AddOAuth2ScopeCommand } from './add-oauth2scope.command';
import { ClientManagementAggregateService } from '../../aggregates';

@CommandHandler(AddOAuth2ScopeCommand)
export class AddOAuth2ScopeHandler
  implements ICommandHandler<AddOAuth2ScopeCommand> {
  constructor(
    private readonly manager: ClientManagementAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: AddOAuth2ScopeCommand) {
    const { actorUserUuid, scope } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.addScope(scope, actorUserUuid);
    aggregate.commit();
  }
}
