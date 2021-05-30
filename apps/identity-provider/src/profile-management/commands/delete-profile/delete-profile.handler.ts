import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { DeleteProfileCommand } from './delete-profile.command';
import { ProfileManagerAggregateService } from '../../aggregates/profile-manager-aggregate/profile-manager-aggregate.service';

@CommandHandler(DeleteProfileCommand)
export class DeleteProfileHandler
  implements ICommandHandler<DeleteProfileCommand>
{
  constructor(
    private readonly manager: ProfileManagerAggregateService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: DeleteProfileCommand) {
    const { uuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.deleteProfile(uuid);
    aggregate.commit();
  }
}
