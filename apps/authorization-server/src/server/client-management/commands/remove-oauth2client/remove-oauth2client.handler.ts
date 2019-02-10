import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveOAuth2ClientCommand } from './remove-oauth2client.command';
import { ClientManagementAggregateService } from '../../../client-management/aggregates';
import { from } from 'rxjs';

@CommandHandler(RemoveOAuth2ClientCommand)
export class RemoveOAuth2ClientHandler
  implements ICommandHandler<RemoveOAuth2ClientCommand> {
  constructor(
    private readonly manager: ClientManagementAggregateService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: RemoveOAuth2ClientCommand, resolve: (value?) => void) {
    const { actorUserUuid, clientId } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);

    from(this.manager.removeClient(clientId, actorUserUuid)).subscribe({
      next: success => resolve(aggregate.commit()),
      error: error => resolve(Promise.reject(error)),
    });
  }
}
