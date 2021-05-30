import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SystemSettingsChangedEvent } from './server-settings-changed.event';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

@EventsHandler(SystemSettingsChangedEvent)
export class SystemSettingsChangedHandler
  implements IEventHandler<SystemSettingsChangedEvent>
{
  constructor(private readonly settings: ServerSettingsService) {}
  async handle(event: SystemSettingsChangedEvent) {
    const { settings } = event;
    // TODO: Use Actor User Uuid
    await this.settings.update(settings);
  }
}
