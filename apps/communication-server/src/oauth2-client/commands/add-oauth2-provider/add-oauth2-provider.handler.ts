import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AddOAuth2ProviderCommand } from './add-oauth2-provider.command';
import { Oauth2ProviderAggregateService } from '../../aggregates/oauth2-provider-aggregate/oauth2-provider-aggregate.service';

@CommandHandler(AddOAuth2ProviderCommand)
export class AddOAuth2ProviderHandler
  implements ICommandHandler<AddOAuth2ProviderCommand>
{
  constructor(
    private publisher: EventPublisher,
    private manager: Oauth2ProviderAggregateService,
  ) {}

  async execute(command: AddOAuth2ProviderCommand) {
    const { payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.addProvider(payload);
    aggregate.commit();
  }
}
