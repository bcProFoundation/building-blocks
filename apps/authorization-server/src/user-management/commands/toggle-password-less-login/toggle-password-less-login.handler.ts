import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import {
  TogglePasswordLessLoginCommand,
  TogglePasswordLessLogin,
} from './toggle-password-less-login.command';
import { UserAggregateService } from '../../aggregates/user-aggregate/user-aggregate.service';

@CommandHandler(TogglePasswordLessLoginCommand)
export class TogglePasswordLessLoginHandler
  implements ICommandHandler<TogglePasswordLessLoginCommand> {
  constructor(
    private readonly manager: UserAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: TogglePasswordLessLoginCommand) {
    const { userUuid, toggle } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    if (toggle === TogglePasswordLessLogin.Enable) {
      await aggregate.enablePasswordLessLogin(userUuid);
      aggregate.commit();
    } else if (toggle === TogglePasswordLessLogin.Disable) {
      await aggregate.disablePasswordLessLogin(userUuid);
      aggregate.commit();
    }
  }
}
