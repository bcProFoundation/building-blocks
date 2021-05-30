import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveSocialLoginCommand } from './remove-social-login.command';
import { SocialLoginManagementService } from '../../aggregates/social-login-management/social-login-management.service';

@CommandHandler(RemoveSocialLoginCommand)
export class RemoveSocialLoginHandler
  implements ICommandHandler<RemoveSocialLoginCommand>
{
  constructor(
    private readonly manager: SocialLoginManagementService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveSocialLoginCommand) {
    const { userUuid, socialLoginUuid } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.removeSocialLogin(socialLoginUuid, userUuid);
    aggregate.commit();
  }
}
