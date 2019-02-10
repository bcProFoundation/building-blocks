import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveUserAccountCommand } from './remove-user-account.command';
import { UserManagementService } from '../../../user-management/aggregates/user-management/user-management.service';
import { from } from 'rxjs';

@CommandHandler(RemoveUserAccountCommand)
export class RemoveUserAccountHandler
  implements ICommandHandler<RemoveUserAccountCommand> {
  constructor(
    private readonly manager: UserManagementService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveUserAccountCommand, resolve: (value?) => void) {
    const { actorUserUuid, userUuidToBeDeleted } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);

    from(this.manager.deleteUser(userUuidToBeDeleted, actorUserUuid)).subscribe(
      {
        next: success => resolve(aggregate.commit()),
        error: error => resolve(Promise.reject(error)),
      },
    );
  }
}
