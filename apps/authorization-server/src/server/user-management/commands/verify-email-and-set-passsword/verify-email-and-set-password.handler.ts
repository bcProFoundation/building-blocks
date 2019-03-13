import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { VerifyEmailAndSetPasswordCommand } from './verify-email-and-set-password.command';
import { UserAggregateService } from '../../aggregates/user-aggregate/user-aggregate.service';
import { from } from 'rxjs';

@CommandHandler(VerifyEmailAndSetPasswordCommand)
export class VerifyEmailAndSetPasswordHandler
  implements ICommandHandler<VerifyEmailAndSetPasswordCommand> {
  constructor(
    private readonly manager: UserAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  execute(
    command: VerifyEmailAndSetPasswordCommand,
    resolve: (value?: any) => void,
  ) {
    const { payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    from(this.manager.verifyEmail(payload)).subscribe({
      next: success => resolve(aggregate.commit()),
      error: error => resolve(Promise.reject(error)),
    });
  }
}
