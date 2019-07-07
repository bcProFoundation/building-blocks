import { Injectable } from '@nestjs/common';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ProfileService } from '../../../profile-management/entities/profile/profile.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

@Injectable()
export class ConnectService {
  constructor(
    private readonly tokenCacheService: TokenCacheService,
    private readonly profileService: ProfileService,
    private readonly settings: ServerSettingsService,
  ) {}

  async tokenDelete(accessToken: string) {
    await this.checkAndClearSettings(accessToken);
    await this.tokenCacheService.deleteMany({ accessToken });
  }

  async deleteProfile(uuid: string) {
    return await this.profileService.deleteProfile({ uuid });
  }

  async checkAndClearSettings(accessToken: string) {
    const settings = await this.settings.find();
    const token = await this.tokenCacheService.findOne({ accessToken });
    if (token.uuid === settings.clientTokenUuid) {
      settings.clientTokenUuid = undefined;
      await settings.save();
    }
    await token.remove();
  }
}
