import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AddServiceTypeCommand } from './add-service-type.command';
import { ServiceAggregateService } from '../../aggregates/service-aggregate/service-aggregate.service';

@CommandHandler(AddServiceTypeCommand)
export class AddServiceTypeHandler
  implements ICommandHandler<AddServiceTypeCommand> {
  constructor(
    private readonly manager: ServiceAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: AddServiceTypeCommand) {
    const { payload } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);

    await aggregate.addServiceType(payload);
    aggregate.commit();
  }
}
