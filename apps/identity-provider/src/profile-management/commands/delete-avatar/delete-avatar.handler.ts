import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { DeleteAvatarCommand } from './delete-avatar.command';
import { ProfileManagerAggregateService } from '../../aggregates/profile-manager-aggregate/profile-manager-aggregate.service';

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarHandler
  implements ICommandHandler<DeleteAvatarCommand>
{
  constructor(
    private readonly manager: ProfileManagerAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteAvatarCommand) {
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.deleteAvatar(command.profileUuid, command.req);
    aggregate.commit();
  }
}
