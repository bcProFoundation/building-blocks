import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RegisterServiceCommand } from './register-service.command';
import { ServiceAggregateService } from '../../aggregates/service-aggregate/service-aggregate.service';

@CommandHandler(RegisterServiceCommand)
export class RegisterServiceHandler
  implements ICommandHandler<RegisterServiceCommand> {
  constructor(
    private readonly manager: ServiceAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RegisterServiceCommand) {
    const { payload, token } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);

    await aggregate.addService(payload, token);
    aggregate.commit();
  }
}
