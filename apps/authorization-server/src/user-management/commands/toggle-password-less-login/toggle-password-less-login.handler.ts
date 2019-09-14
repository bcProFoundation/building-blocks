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
    const { actorUuid, userUuid, toggle } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    if (toggle === TogglePasswordLessLogin.Enable) {
      await aggregate.enablePasswordLessLogin(
        actorUuid,
        userUuid ? userUuid : actorUuid,
      );
      aggregate.commit();
    } else if (toggle === TogglePasswordLessLogin.Disable) {
      await aggregate.disablePasswordLessLogin(
        actorUuid,
        userUuid ? userUuid : actorUuid,
      );
      aggregate.commit();
    }
  }
}
