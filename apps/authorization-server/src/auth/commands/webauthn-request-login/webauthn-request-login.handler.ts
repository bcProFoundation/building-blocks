import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { WebAuthnRequestLoginCommand } from './webauthn-request-login.command';
import { WebAuthnAggregateService } from '../../aggregates/webauthn-aggregate/webauthn-aggregate.service';

@CommandHandler(WebAuthnRequestLoginCommand)
export class WebAuthnRequestLoginHandler
  implements ICommandHandler<WebAuthnRequestLoginCommand>
{
  constructor(
    private readonly manager: WebAuthnAggregateService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: WebAuthnRequestLoginCommand) {
    const { username } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const challenge = await aggregate.login(username);
    aggregate.commit();
    return challenge;
  }
}
