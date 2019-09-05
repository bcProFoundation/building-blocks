import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AddUserRoleCommand } from './add-user-role.command';
import { UserManagementService } from '../../aggregates/user-management/user-management.service';

@CommandHandler(AddUserRoleCommand)
export class AddUserRoleHandler implements ICommandHandler<AddUserRoleCommand> {
  constructor(
    private readonly manager: UserManagementService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: AddUserRoleCommand) {
    const { actorUuid, role } = command;
    const aggregate = this.eventPublisher.mergeObjectContext(this.manager);

    const savedRole = await aggregate.addRole(role, actorUuid);
    aggregate.commit();
    return savedRole;
  }
}
