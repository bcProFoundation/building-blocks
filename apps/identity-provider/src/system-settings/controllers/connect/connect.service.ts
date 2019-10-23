import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { DeleteProfileCommand } from '../../../profile-management/commands/delete-profile/delete-profile.command';

@Injectable()
export class ConnectService {
  constructor(
    private readonly tokenCacheService: TokenCacheService,
    private readonly settings: ServerSettingsService,
    private readonly commandBus: CommandBus,
  ) {}

  async tokenDelete(accessToken: string) {
    await this.checkAndClearSettings(accessToken);
    await this.tokenCacheService.deleteMany({ accessToken });
  }

  async deleteProfile(uuid: string) {
    await this.commandBus.execute(new DeleteProfileCommand(uuid));
  }

  async checkAndClearSettings(accessToken: string) {
    const settings = await this.settings.find();
    const token = await this.tokenCacheService.findOne({ accessToken });
    if (token && token.uuid === settings.clientTokenUuid) {
      settings.clientTokenUuid = undefined;
      await settings.save();
    }

    if (token) await token.remove();
  }
}
