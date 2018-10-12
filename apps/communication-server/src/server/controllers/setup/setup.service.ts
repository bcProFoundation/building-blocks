import { Injectable, HttpService } from '@nestjs/common';
import { settingsAlreadyExists, somethingWentWrong } from '../../exceptions';
import { ServerSettings } from '../../models/server-settings/server-settings.entity';
import { ServerSettingsService } from '../../models/server-settings/server-settings.service';

@Injectable()
export class SetupService {
  protected idpSettings: ServerSettings;

  constructor(
    protected readonly idpSettingsService: ServerSettingsService,
    protected readonly http: HttpService,
  ) {}

  async setup(params) {
    if (await this.idpSettingsService.count()) {
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
          this.idpSettings = await this.idpSettingsService.save(params);
          return this.idpSettings;
        },
        error: error => {
          // TODO : meaningful errors
          throw somethingWentWrong;
        },
      });
  }

  async getInfo() {
    const info = await this.idpSettingsService.find();
    if (info) {
      delete info.clientSecret, info._id;
    }
    return info;
  }
}
