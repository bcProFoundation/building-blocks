import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { DeleteBearerTokensCommand } from './delete-bearer-tokens.command';
import { SystemSettingsManagementService } from '../../aggregates';

@CommandHandler(DeleteBearerTokensCommand)
export class DeleteBearerTokensHandler
  implements ICommandHandler<DeleteBearerTokensCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: SystemSettingsManagementService,
  ) {}

  async execute(command: DeleteBearerTokensCommand) {
    const { actorUuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.deleteBearerTokens(actorUuid);
    aggregate.commit();
  }
}
