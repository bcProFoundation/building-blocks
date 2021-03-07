import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveUserAccountCommand } from './remove-user-account.command';
import { UserManagementService } from '../../../user-management/aggregates/user-management/user-management.service';
import { InvalidRequestToDeleteUser } from '../../../common/filters/exceptions';
@CommandHandler(RemoveUserAccountCommand)
export class RemoveUserAccountHandler
  implements ICommandHandler<RemoveUserAccountCommand> {
  constructor(
    private readonly manager: UserManagementService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveUserAccountCommand) {
    const { actorUserUuid, userUuidToBeDeleted, clientId } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);

    if (clientId) {
      await aggregate.deleteUserByTrustedClient(userUuidToBeDeleted, clientId);
      aggregate.commit();
    } else if (actorUserUuid) {
      await aggregate.deleteUserByUser(userUuidToBeDeleted, actorUserUuid);
      aggregate.commit();
    } else {
      throw new InvalidRequestToDeleteUser();
    }
  }
}
