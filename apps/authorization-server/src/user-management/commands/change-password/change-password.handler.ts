import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ChangePasswordCommand } from './change-password.command';
import { UserAggregateService } from '../../../user-management/aggregates/user-aggregate/user-aggregate.service';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler
  implements ICommandHandler<ChangePasswordCommand>
{
  constructor(
    private readonly manager: UserAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ChangePasswordCommand) {
    const { userUuid, passwordPayload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);

    await this.manager.validatePassword(userUuid, passwordPayload);
    aggregate.commit();
  }
}
