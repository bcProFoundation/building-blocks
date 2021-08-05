import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { SetupService } from '../../controllers/setup/setup.service';
import { SetupServerCommand } from './setup-server.command';

@CommandHandler(SetupServerCommand)
export class SetupServerHandler implements ICommandHandler<SetupServerCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly setup: SetupService,
  ) {}

  async execute(command: SetupServerCommand) {
    const { payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.setup);
    const response = await aggregate.setupInfrastructureClient(
      payload?.fullName,
      payload?.email,
      payload?.phone,
      payload?.infrastructureConsoleUrl,
      payload?.adminPassword,
      payload?.issuerUrl,
      payload?.organizationName,
    );
    aggregate.commit();
    return response;
  }
}
