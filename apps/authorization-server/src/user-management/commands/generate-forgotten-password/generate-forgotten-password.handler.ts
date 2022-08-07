import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { GenerateForgottenPasswordCommand } from './generate-forgotten-password.command';
import { UserManagementService } from '../../../user-management/aggregates/user-management/user-management.service';

@CommandHandler(GenerateForgottenPasswordCommand)
export class GenerateForgottenPasswordHandler
  implements ICommandHandler<GenerateForgottenPasswordCommand>
{
  constructor(
    private readonly manager: UserManagementService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: GenerateForgottenPasswordCommand) {
    const { userEmailOrPhone, redirect } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.generateForgottenPassword(userEmailOrPhone, redirect);
    aggregate.commit();
  }
}
