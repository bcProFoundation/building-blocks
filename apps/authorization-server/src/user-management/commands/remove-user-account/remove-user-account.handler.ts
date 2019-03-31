import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveUserAccountCommand } from './remove-user-account.command';
import { UserManagementService } from '../../../user-management/aggregates/user-management/user-management.service';

@CommandHandler(RemoveUserAccountCommand)
export class RemoveUserAccountHandler
  implements ICommandHandler<RemoveUserAccountCommand> {
  constructor(
    private readonly manager: UserManagementService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveUserAccountCommand) {
    const { actorUserUuid, userUuidToBeDeleted } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);

    await this.manager.deleteUser(userUuidToBeDeleted, actorUserUuid);
    aggregate.commit();
  }
}
