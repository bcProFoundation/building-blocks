import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ModifyUserRoleCommand } from './modify-user-role.command';
import { UserManagementService } from '../../aggregates/user-management/user-management.service';

@CommandHandler(ModifyUserRoleCommand)
export class ModifyUserRoleHandler
  implements ICommandHandler<ModifyUserRoleCommand>
{
  constructor(
    private readonly manager: UserManagementService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ModifyUserRoleCommand) {
    const { actorUuid, role, uuid } = command;
    const aggregate = this.eventPublisher.mergeObjectContext(this.manager);

    const savedRole = await aggregate.modifyRole(uuid, role, actorUuid);
    aggregate.commit();
    return savedRole;
  }
}
