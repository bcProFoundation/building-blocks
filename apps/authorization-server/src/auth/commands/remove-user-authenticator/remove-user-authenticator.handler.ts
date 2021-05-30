import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveUserAuthenticatorCommand } from './remove-user-authenticator.command';
import { WebAuthnAggregateService } from '../../aggregates/webauthn-aggregate/webauthn-aggregate.service';

@CommandHandler(RemoveUserAuthenticatorCommand)
export class RemoveUserAuthenticatorHandler
  implements ICommandHandler<RemoveUserAuthenticatorCommand>
{
  constructor(
    private readonly manager: WebAuthnAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveUserAuthenticatorCommand) {
    const { uuid, actorUuid, userUuid } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.removeAuthenticator(uuid, actorUuid, userUuid);
    aggregate.commit();
  }
}
