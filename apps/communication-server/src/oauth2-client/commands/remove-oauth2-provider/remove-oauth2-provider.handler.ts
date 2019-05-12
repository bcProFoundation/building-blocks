import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveOAuth2ProviderCommand } from './remove-oauth2-provider.command';
import { Oauth2ProviderAggregateService } from '../../aggregates/oauth2-provider-aggregate/oauth2-provider-aggregate.service';

@CommandHandler(RemoveOAuth2ProviderCommand)
export class RemoveOAuth2ProviderHandler
  implements ICommandHandler<RemoveOAuth2ProviderCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: Oauth2ProviderAggregateService,
  ) {}

  async execute(command: RemoveOAuth2ProviderCommand) {
    // TODO: record actorUuid from command
    const { providerUuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.removeProvider(providerUuid);
    aggregate.commit();
  }
}
