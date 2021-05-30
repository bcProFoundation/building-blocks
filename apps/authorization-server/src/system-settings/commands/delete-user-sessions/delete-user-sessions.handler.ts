import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { DeleteUserSessionsCommand } from './delete-user-sessions.command';
import { SystemSettingsManagementService } from '../../aggregates';

@CommandHandler(DeleteUserSessionsCommand)
export class DeleteUserSessionsHandler
  implements ICommandHandler<DeleteUserSessionsCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: SystemSettingsManagementService,
  ) {}
  async execute(command: DeleteUserSessionsCommand) {
    const { actorUuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.deleteUserSessions(actorUuid);
    aggregate.commit();
  }
}
