import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveServiceCommand } from './remove-service.command';
import { ServiceAggregateService } from '../../aggregates/service-aggregate/service-aggregate.service';

@CommandHandler(RemoveServiceCommand)
export class RemoveServiceHandler
  implements ICommandHandler<RemoveServiceCommand> {
  constructor(
    private readonly manager: ServiceAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveServiceCommand) {
    const { clientId } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.removeService(clientId);
    aggregate.commit();
  }
}
