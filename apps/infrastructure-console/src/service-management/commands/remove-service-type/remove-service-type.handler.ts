import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveServiceTypeCommand } from './remove-service-type.command';
import { ServiceAggregateService } from '../../aggregates/service-aggregate/service-aggregate.service';

@CommandHandler(RemoveServiceTypeCommand)
export class RemoveServiceTypeHandler
  implements ICommandHandler<RemoveServiceTypeCommand>
{
  constructor(
    private readonly manager: ServiceAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveServiceTypeCommand) {
    const { name } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.removeServiceType(name);
    aggregate.commit();
  }
}
