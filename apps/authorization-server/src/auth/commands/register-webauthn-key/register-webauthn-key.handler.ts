import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RegisterWebAuthnKeyCommand } from './register-webauthn-key.command';
import { WebAuthnAggregateService } from '../../aggregates/webauthn-aggregate/webauthn-aggregate.service';

@CommandHandler(RegisterWebAuthnKeyCommand)
export class RegisterWebAuthnKeyHandler
  implements ICommandHandler<RegisterWebAuthnKeyCommand>
{
  constructor(
    private readonly manager: WebAuthnAggregateService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: RegisterWebAuthnKeyCommand) {
    const { body, actorUuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const registered = await aggregate.register(body, actorUuid);
    aggregate.commit();
    return registered;
  }
}
