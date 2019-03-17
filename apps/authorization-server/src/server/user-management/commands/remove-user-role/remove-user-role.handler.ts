import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveUserRoleCommand } from './remove-user-role.command';
import { UserManagementService } from '../../../user-management/aggregates/user-management/user-management.service';

@CommandHandler(RemoveUserRoleCommand)
export class RemoveUserRoleHandler
  implements ICommandHandler<RemoveUserRoleCommand> {
  constructor(
    private readonly manager: UserManagementService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: RemoveUserRoleCommand) {
    const { actorUserUuid, roleName } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.deleteRole(roleName, actorUserUuid);
    aggregate.commit();
  }
}
