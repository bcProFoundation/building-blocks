import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { SignUpSocialLoginUserCommand } from './sign-up-social-login-user.command';
import { SocialLoginManagementService } from '../../aggregates/social-login-management/social-login-management.service';

@CommandHandler(SignUpSocialLoginUserCommand)
export class SignUpSocialLoginUserHandler
  implements ICommandHandler<SignUpSocialLoginUserCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: SocialLoginManagementService,
  ) {}
  async execute(command: SignUpSocialLoginUserCommand) {
    const { email, name, socialLogin } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const user = await aggregate.signUpSocialLoginUser(
      email,
      name,
      socialLogin,
    );
    aggregate.commit();
    return user;
  }
}
