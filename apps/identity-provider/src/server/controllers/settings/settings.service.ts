import { Injectable } from '@nestjs/common';
import { IdentityProviderSettingsService } from '../../models/identity-provider-settings/identity-provider-settings.service';
import { settingsAlreadyExists } from '../../exceptions';

@Injectable()
export class SettingsService {
  constructor(
    protected readonly idpSettingsService: IdentityProviderSettingsService,
  ) {}

  async setup(params) {
    if (await this.idpSettingsService.count()) {
      throw settingsAlreadyExists;
    }
    return await this.idpSettingsService.save(params);
  }
}
