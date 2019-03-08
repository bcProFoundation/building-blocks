import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { ChangePasswordCommand } from './change-password.command';
import { UserAggregateService } from '../../../user-management/aggregates/user-aggregate/user-aggregate.service';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler
  implements ICommandHandler<ChangePasswordCommand> {
  constructor(
    private readonly manager: UserAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  execute(command: ChangePasswordCommand, resolve: (value?: any) => void) {
    const { userUuid, passwordPayload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);

    from(this.manager.validatePassword(userUuid, passwordPayload)).subscribe({
      next: success => resolve(aggregate.commit()),
      error: error => resolve(Promise.reject(error)),
    });
  }
}
