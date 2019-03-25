import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ModifyUserAccountCommand } from './modify-user-account.command';
import { UserManagementService } from '../../aggregates/user-management/user-management.service';

@CommandHandler(ModifyUserAccountCommand)
export class ModifyUserAccountHandler
  implements ICommandHandler<ModifyUserAccountCommand> {
  constructor(
    private readonly manager: UserManagementService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ModifyUserAccountCommand) {
    const { actorUserUuid, userUuidToBeModified, userData } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const user = await aggregate.updateUserAccount(
      userUuidToBeModified,
      userData,
      actorUserUuid,
    );
    aggregate.commit();

    return {
      name: user.name,
      email: user.email,
      roles: user.roles,
      phone: user.phone,
    };
  }
}
