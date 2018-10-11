import { Injectable, HttpService } from '@nestjs/common';
import { settingsAlreadyExists, somethingWentWrong } from 'exceptions';
import { ServerSettingsService } from 'models/server-settings/server-settings.service';
import { ServerSettings } from 'models/server-settings/server-settings.entity';

@Injectable()
export class SetupService {
  protected icSettings: ServerSettings;

  constructor(
    protected readonly icSettingsService: ServerSettingsService,
    protected readonly http: HttpService,
  ) {}

  async setup(params) {
    if (await this.icSettingsService.count()) {
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
          this.icSettings = await this.icSettingsService.save(params);
          return this.icSettings;
        },
        error: error => {
          // TODO : meaningful errors
          throw somethingWentWrong;
        },
      });
  }

  async getInfo() {
    const info = await this.icSettingsService.find();
    if (info) {
      delete info.clientSecret, info._id;
    }
    return info;
  }
}
