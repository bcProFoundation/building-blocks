import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RenameUserAuthenticatorCommand } from './rename-user-authenticator.command';
import { WebAuthnAggregateService } from '../../aggregates/webauthn-aggregate/webauthn-aggregate.service';

@CommandHandler(RenameUserAuthenticatorCommand)
export class RenameUserAuthenticatorHandler
  implements ICommandHandler<RenameUserAuthenticatorCommand> {
  constructor(
    private readonly manager: WebAuthnAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RenameUserAuthenticatorCommand) {
    const { uuid, name, actorUuid } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const renamed = await aggregate.renameAuthenticator(uuid, name, actorUuid);
    aggregate.commit();
    return renamed;
  }
}
