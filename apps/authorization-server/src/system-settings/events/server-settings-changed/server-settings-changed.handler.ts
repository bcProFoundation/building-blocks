import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SystemSettingsChangedEvent } from './server-settings-changed.event';

@EventsHandler(SystemSettingsChangedEvent)
export class SystemSettingsChangedHandler
  implements IEventHandler<SystemSettingsChangedEvent> {
  async handle(event: SystemSettingsChangedEvent) {
    const { settings } = event;
    // TODO: Use Actor User Uuid
    await settings.save();
  }
}
