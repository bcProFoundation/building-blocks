import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { WebAuthnLoginCommand } from './webauthn-login.command';
import { WebAuthnAggregateService } from '../../aggregates/webauthn-aggregate/webauthn-aggregate.service';

@CommandHandler(WebAuthnLoginCommand)
export class WebAuthnLoginHandler
  implements ICommandHandler<WebAuthnLoginCommand>
{
  constructor(
    private readonly manager: WebAuthnAggregateService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: WebAuthnLoginCommand) {
    const { req } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const loggedIn = await aggregate.loginChallenge(req);
    aggregate.commit();
    return loggedIn;
  }
}
