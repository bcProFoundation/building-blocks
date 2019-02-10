import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveSocialLoginCommand } from './remove-social-login.command';
import { SocialLoginManagementService } from '../../../auth/aggregates/social-login-management/social-login-management.service';
import { from } from 'rxjs';

@CommandHandler(RemoveSocialLoginCommand)
export class RemoveSocialLoginHandler
  implements ICommandHandler<RemoveSocialLoginCommand> {
  constructor(
    private readonly manager: SocialLoginManagementService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveSocialLoginCommand, resolve: (value?) => void) {
    const { userUuid, socialLoginUuid } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);

    from(this.manager.removeSocialLogin(socialLoginUuid, userUuid)).subscribe({
      next: success => resolve(aggregate.commit()),
      error: error => resolve(Promise.reject(error)),
    });
  }
}
