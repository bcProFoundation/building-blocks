import { Injectable, HttpService } from '@nestjs/common';
import { settingsAlreadyExists } from '../../exceptions';
import { ServerSettings } from '../../models/server-settings/server-settings.entity';
import { ServerSettingsService } from '../../models/server-settings/server-settings.service';

@Injectable()
export class SetupService {
  protected idpSettings: ServerSettings;

  constructor(
    protected readonly serverSettingsService: ServerSettingsService,
    protected readonly http: HttpService,
  ) {}

  async setup(params) {
    if (await this.serverSettingsService.count()) {
      throw settingsAlreadyExists;
    }
    this.http
      .get(params.authServerURL + '/.well-known/openid-configuration')
      .subscribe({
        next: async response => {
          params.authorizationURL = response.data.authorization_endpoint;
          params.tokenURL = response.data.token_endpoint;
          params.profileURL = response.data.userinfo_endpoint;
          params.revocationURL = response.data.revocation_endpoint;
          params.introspectionURL = response.data.introspection_endpoint;
          params.callbackURLs = [
            params.appURL + '/index.html',
            params.appURL + '/silent-refresh.html',
          ];
          this.idpSettings = await this.serverSettingsService.save(params);
          return this.idpSettings;
        },
        error: error => {
          // TODO : Log error
        },
      });
  }

  async getInfo() {
    const info = await this.serverSettingsService.find();
    if (info) {
      delete info.clientSecret, info._id;
    }
    return info;
  }
}
