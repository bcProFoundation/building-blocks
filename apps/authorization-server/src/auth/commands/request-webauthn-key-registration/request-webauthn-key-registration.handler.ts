import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RequestWebAuthnKeyRegistrationCommand } from './request-webauthn-key-registration.command';
import { WebAuthnAggregateService } from '../../aggregates/webauthn-aggregate/webauthn-aggregate.service';

@CommandHandler(RequestWebAuthnKeyRegistrationCommand)
export class RequestWebAuthnKeyRegistrationHandler
  implements ICommandHandler<RequestWebAuthnKeyRegistrationCommand>
{
  constructor(
    private readonly manager: WebAuthnAggregateService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: RequestWebAuthnKeyRegistrationCommand) {
    const { actorUuid, userUuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const challenge = await aggregate.requestRegister(actorUuid, userUuid);
    aggregate.commit();
    return challenge;
  }
}
