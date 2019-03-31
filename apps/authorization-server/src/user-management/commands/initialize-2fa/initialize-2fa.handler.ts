import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Initialize2FACommand } from './initialize-2fa.command';
import { UserAggregateService } from '../../aggregates/user-aggregate/user-aggregate.service';

@CommandHandler(Initialize2FACommand)
export class Initialize2FAHandler
  implements ICommandHandler<Initialize2FACommand> {
  constructor(
    private readonly manager: UserAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: Initialize2FACommand) {
    const { actor, restart } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const qrCode = await aggregate.initializeMfa(actor, restart);
    aggregate.commit();
    return qrCode;
  }
}
