import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UpdateUserFullNameCommand } from './update-user-full-name.command';
import { UserManagementService } from '../../aggregates/user-management/user-management.service';

@CommandHandler(UpdateUserFullNameCommand)
export class UpdateUserFullNameHandler
  implements ICommandHandler<UpdateUserFullNameCommand> {
  constructor(
    private readonly manager: UserManagementService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateUserFullNameCommand) {
    const { actorUserUuid, name } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const user = await aggregate.updateUserFullName(name, actorUserUuid);
    aggregate.commit();

    return {
      name: user.name,
      email: user.email,
      roles: user.roles,
      phone: user.phone,
    };
  }
}
