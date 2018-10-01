import { Injectable } from '@nestjs/common';
import * as jose from 'node-jose';
import { IDTokenClaims } from '../../middlewares/interfaces';
import { OIDCKeyService } from '../../../models/oidc-key/oidc-key.service';
import { ServerSettingsService } from '../../../models/server-settings/server-settings.service';
import { ServerSettings } from '../../../models/interfaces/server-settings.interface';
import { JWKSNotFound } from '../../filters/exceptions';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class IDTokenGrantService {
  settings: ServerSettings;

  constructor(
    private readonly oidcKeyService: OIDCKeyService,
    private readonly settingsService: ServerSettingsService,
    private readonly configService: ConfigService,
  ) {}

  async grantIDToken(client, user, req, done) {
    try {
      if (!this.settings) this.settings = await this.settingsService.find();

      const issuedAt = Date.parse(new Date().toString()) / 1000;

      const claims: IDTokenClaims = {
        iss: this.settings.issuerUrl,
        aud: client.clientId,
        iat: Math.trunc(issuedAt),
        exp:
          Math.trunc(issuedAt) +
          Number(this.configService.get('TOKEN_VALIDITY')),
        sub: user.uuid,
        nonce: req.nonce,
      };

      if (req.scope.includes('roles')) claims.roles = user.roles;

      const jwks = await this.oidcKeyService.find();
      const foundKey = jwks[0];
      if (!foundKey) {
        throw JWKSNotFound;
      }

      const signedToken = await jose.JWS.createSign(
        { alg: 'RS256', format: 'compact' },
        foundKey.keyPair,
      )
        .update(JSON.stringify(claims))
        .final();

      done(null, signedToken);
    } catch (error) {
      done(error, null);
    }
  }
}
