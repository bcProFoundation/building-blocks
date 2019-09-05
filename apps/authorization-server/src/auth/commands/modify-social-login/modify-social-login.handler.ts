import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ModifySocialLoginCommand } from './modify-social-login.command';
import { SocialLoginManagementService } from '../../aggregates/social-login-management/social-login-management.service';

@CommandHandler(ModifySocialLoginCommand)
export class ModifySocialLoginHandler
  implements ICommandHandler<ModifySocialLoginCommand> {
  constructor(
    private readonly manager: SocialLoginManagementService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: ModifySocialLoginCommand) {
    const { payload, uuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const socialLogin = await aggregate.modifySocialLogin(payload, uuid);
    aggregate.commit();
    return socialLogin;
  }
}
