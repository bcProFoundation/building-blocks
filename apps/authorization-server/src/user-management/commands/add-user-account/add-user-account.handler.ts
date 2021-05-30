import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AddUserAccountCommand } from './add-user-account.command';
import { UserManagementService } from '../../aggregates/user-management/user-management.service';

@CommandHandler(AddUserAccountCommand)
export class AddUserAccountHandler
  implements ICommandHandler<AddUserAccountCommand>
{
  constructor(
    private readonly manager: UserManagementService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: AddUserAccountCommand) {
    const { actorUuid, userData } = command;
    const aggregate = this.eventPublisher.mergeObjectContext(this.manager);

    const user = await aggregate.addUserAccount(userData, actorUuid);
    aggregate.commit();
    return user;
  }
}
