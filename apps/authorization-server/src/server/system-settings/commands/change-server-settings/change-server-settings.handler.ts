import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ChangeServerSettingsCommand } from './change-server-settings.command';
import { SystemSettingsManagementService } from '../../aggregates';

@CommandHandler(ChangeServerSettingsCommand)
export class ChangeServerSettingsHandler
  implements ICommandHandler<ChangeServerSettingsCommand> {
  constructor(
    private readonly manager: SystemSettingsManagementService,
    private readonly pulisher: EventPublisher,
  ) {}
  async execute(command: ChangeServerSettingsCommand) {
    const { actorUserUuid, payload } = command;
    const aggregate = this.pulisher.mergeObjectContext(this.manager);
    const settings = await aggregate.updateSettings(actorUserUuid, payload);
    aggregate.commit();
    return {
      settings,
      modifiedBy: actorUserUuid,
    };
  }
}
