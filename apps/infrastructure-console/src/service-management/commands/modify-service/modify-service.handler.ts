import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ModifyServiceCommand } from './modify-service.command';
import { ServiceAggregateService } from 'service-management/aggregates/service-aggregate/service-aggregate.service';

@CommandHandler(ModifyServiceCommand)
export class ModifyServiceHandler
  implements ICommandHandler<ModifyServiceCommand> {
  constructor(
    private readonly manager: ServiceAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ModifyServiceCommand) {
    const { clientId, payload } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.modifyService(clientId, payload);
    aggregate.commit();
  }
}
