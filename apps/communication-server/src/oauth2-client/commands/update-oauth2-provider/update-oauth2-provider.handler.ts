import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UpdateOAuth2ProviderCommand } from './update-oauth2-provider.command';
import { Oauth2ProviderAggregateService } from '../../aggregates/oauth2-provider-aggregate/oauth2-provider-aggregate.service';

@CommandHandler(UpdateOAuth2ProviderCommand)
export class UpdateOAuth2ProviderHandler
  implements ICommandHandler<UpdateOAuth2ProviderCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: Oauth2ProviderAggregateService,
  ) {}

  async execute(command: UpdateOAuth2ProviderCommand) {
    const { providerUuid, payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.updateProvider(providerUuid, payload);
    aggregate.commit();
  }
}
