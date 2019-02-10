import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { GenerateForgottenPasswordCommand } from './generate-forgotten-password.command';
import { UserManagementService } from '../../../user-management/aggregates/user-management/user-management.service';
import { from } from 'rxjs';

@CommandHandler(GenerateForgottenPasswordCommand)
export class GenerateForgottenPasswordHandler
  implements ICommandHandler<GenerateForgottenPasswordCommand> {
  constructor(
    private readonly manager: UserManagementService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(
    command: GenerateForgottenPasswordCommand,
    resolve: (value?) => void,
  ) {
    const { userEmailOrPhone } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);

    from(this.manager.generateForgottenPassword(userEmailOrPhone)).subscribe({
      next: success => resolve(aggregate.commit()),
      error: error => resolve(Promise.reject(error)),
    });
  }
}
