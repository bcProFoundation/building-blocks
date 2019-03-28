import { IEvent } from '@nestjs/cqrs';
import { ServerSettings } from '../../entities/server-settings/server-settings.interface';

export class SystemSettingsChangedEvent implements IEvent {
  constructor(
    public readonly actorUserUuid: string,
    public readonly settings: ServerSettings,
  ) {}
}
