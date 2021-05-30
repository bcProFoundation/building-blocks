import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveOAuth2ClientCommand } from './remove-oauth2client.command';
import { ClientManagementAggregateService } from '../../../client-management/aggregates';

@CommandHandler(RemoveOAuth2ClientCommand)
export class RemoveOAuth2ClientHandler
  implements ICommandHandler<RemoveOAuth2ClientCommand>
{
  constructor(
    private readonly manager: ClientManagementAggregateService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: RemoveOAuth2ClientCommand) {
    const { actorUserUuid, clientId } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.removeClient(clientId, actorUserUuid);
    aggregate.commit();
  }
}
