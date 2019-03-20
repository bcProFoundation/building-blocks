import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ModifyUserAccountCommand } from './modify-user-account.command';
import { UserAggregateService } from '../../aggregates/user-aggregate/user-aggregate.service';

@CommandHandler(ModifyUserAccountCommand)
export class ModifyUserAccountHandler
  implements ICommandHandler<ModifyUserAccountCommand> {
  constructor(
    private readonly manager: UserAggregateService,
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
