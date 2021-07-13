import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { settingsAlreadyExists } from '../../../exceptions';
import { ServerSettings } from '../../entities/server-settings/server-settings.entity';
import { ServerSettingsService } from '../../entities/server-settings/server-settings.service';
import {
  AUTHORIZATION_ENDPOINT,
  TOKEN_ENDPOINT,
  USERINFO_ENDPOINT,
  REVOCATION_ENDPOINT,
  INTROSPECTION_ENDPOINT,
} from '../../../constants/url-strings';

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

    params.callbackURLs = [
      params.appURL + '/index.html',
      params.appURL + '/silent-refresh.html',
    ];

    this.http
      .get(params.authServerURL + '/.well-known/openid-configuration')
      .subscribe({
        next: async response => {
          params.authorizationURL = response.data.authorization_endpoint;
          params.tokenURL = response.data.token_endpoint;
          params.profileURL = response.data.userinfo_endpoint;
          params.revocationURL = response.data.revocation_endpoint;
          params.introspectionURL = response.data.introspection_endpoint;
          this.serverSettingsService
            .save(params)
            .then(saved => {})
            .catch(err => {});
        },
        error: error => {
          params.authorizationURL =
            params.authServerURL + AUTHORIZATION_ENDPOINT;
          params.tokenURL = params.authServerURL + TOKEN_ENDPOINT;
          params.profileURL = params.authServerURL + USERINFO_ENDPOINT;
          params.revocationURL = params.authServerURL + REVOCATION_ENDPOINT;
          params.introspectionURL =
            params.authServerURL + INTROSPECTION_ENDPOINT;
          this.serverSettingsService
            .save(params)
            .then(saved => {})
            .catch(err => {});
        },
      });
  }

  async getInfo() {
    const info = await this.serverSettingsService.find();
    if (info) {
      info._id = undefined;
      info.clientSecret = undefined;
    }
    return info;
  }
}
