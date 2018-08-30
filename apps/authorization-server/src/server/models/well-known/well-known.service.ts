import { Injectable } from '@nestjs/common';
import { ServerSettingsService } from '../server-settings/server-settings.service';

@Injectable()
export class WellKnownService {
  constructor(private readonly settingsService: ServerSettingsService) {}

  async getOpenidConfiguration() {
    const settings = await this.settingsService.find();
    const authServerURL = settings.appURL;
    return {
      issuer: authServerURL,
      jwks_uri: `${authServerURL}/.well-known/jwks`,
      authorization_endpoint: `${authServerURL}/oauth2/authorize`,
      token_endpoint: `${authServerURL}/oauth2/get_token`,
      userinfo_endpoint: `${authServerURL}/oauth2/profile`,
      revocation_endpoint: `${authServerURL}/oauth2/revoke`,
      introspection_endpoint: `${authServerURL}/oauth2/introspection`,
      response_types_supported: [
        'id_token',
        'id_token token',
        'code id_token',
        'code token',
        'code id_token token',
      ],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
    };
  }

  async getJWKs() {
    // TODO: Implement jwks
    return [{}];
  }
}
