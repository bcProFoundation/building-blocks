import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AddSocialLoginCommand } from './add-social-login.command';
import { SocialLoginManagementService } from '../../aggregates/social-login-management/social-login-management.service';

@CommandHandler(AddSocialLoginCommand)
export class AddSocialLoginHandler
  implements ICommandHandler<AddSocialLoginCommand> {
  constructor(
    private readonly manager: SocialLoginManagementService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: AddSocialLoginCommand) {
    const { payload, createdBy } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const socialLogin = await aggregate.addSocialLogin(payload, createdBy);
    aggregate.commit();
    return socialLogin;
  }
}
