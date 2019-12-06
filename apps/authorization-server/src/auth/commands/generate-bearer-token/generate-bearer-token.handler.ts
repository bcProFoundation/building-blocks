import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { GenerateBearerTokenCommand } from './generate-bearer-token.command';
import { OAuth2TokenGeneratorService } from '../../oauth2/oauth2-token-generator/oauth2-token-generator.service';

@CommandHandler(GenerateBearerTokenCommand)
export class GenerateBearerTokenHandler
  implements ICommandHandler<GenerateBearerTokenCommand> {
  constructor(
    private readonly manager: OAuth2TokenGeneratorService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: GenerateBearerTokenCommand) {
    const { client, user, scope, refresh, idToken } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const message = await aggregate.getBearerToken(
      client,
      user,
      scope,
      refresh,
      idToken,
    );
    aggregate.commit();
    return message;
  }
}
