import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveUnverifiedUserCommand } from './remove-unverified-user.command';
import { UserManagementService } from '../../aggregates/user-management/user-management.service';

@CommandHandler(RemoveUnverifiedUserCommand)
export class RemoveUnverifiedUserCommandHandler
  implements ICommandHandler<RemoveUnverifiedUserCommand>
{
  constructor(
    private readonly manager: UserManagementService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveUnverifiedUserCommand) {
    const { user } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.deleteUser(user.uuid).catch(error => {});
    aggregate.commit();
  }
}
