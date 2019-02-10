import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveUserRoleCommand } from './remove-user-role.command';
import { UserManagementService } from '../../../user-management/aggregates/user-management/user-management.service';
import { from } from 'rxjs';

@CommandHandler(RemoveUserRoleCommand)
export class RemoveUserRoleHandler
  implements ICommandHandler<RemoveUserRoleCommand> {
  constructor(
    private readonly manager: UserManagementService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: RemoveUserRoleCommand, resolve: (value?) => void) {
    const { actorUserUuid, roleName } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);

    from(this.manager.deleteRole(roleName, actorUserUuid)).subscribe({
      next: success => resolve(aggregate.commit()),
      error: error => resolve(Promise.reject(error)),
    });
  }
}
