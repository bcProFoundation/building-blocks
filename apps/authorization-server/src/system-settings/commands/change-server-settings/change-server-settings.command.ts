import { ICommand } from '@nestjs/cqrs';
import { ServerSettingDto } from '../../entities/server-settings/server-setting.dto';

export class ChangeServerSettingsCommand implements ICommand {
  constructor(
    public readonly actorUserUuid: string,
    public readonly payload: ServerSettingDto,
  ) {}
}
