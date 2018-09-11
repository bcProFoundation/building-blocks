import { Injectable } from '@nestjs/common';
import { ServerSettingsService } from '../server-settings/server-settings.service';
import { OIDCKeyService } from '../oidc-key/oidc-key.service';
import { JWK } from '../../auth/middlewares/interfaces';
import { OIDCKey } from '../oidc-key/oidc-key.entity';

@Injectable()
export class WellKnownService {
  constructor(
    private readonly settingsService: ServerSettingsService,
    private readonly oidcKeyService: OIDCKeyService,
  ) {}

  async getOpenidConfiguration() {
    const settings = await this.settingsService.find();
    const authServerURL = settings.appURL;
    return {
      issuer: authServerURL,
      jwks_uri: `${authServerURL}/.well-known/jwks`,
      authorization_endpoint: `${authServerURL}/oauth2/confirmation`,
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
      id_token_signing_alg_values_supported: ['RS256', 'HS256'],
    };
  }

  async getJWKs() {
    const keys = await this.oidcKeyService.find();

    const out = keys.map((iKey: OIDCKey) => {
      const iKeyJWK: JWK = iKey.keyPair as JWK;
      const oKey: any = {};
      oKey.kty = iKeyJWK.kty;
      oKey.alg = iKeyJWK.alg;
      oKey.n = iKeyJWK.n;
      oKey.e = iKeyJWK.e;
      oKey.kid = iKeyJWK.kid;
      return oKey;
    });

    return {
      keys: out,
    };
  }
}
