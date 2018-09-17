import { Injectable } from '@nestjs/common';
import * as jose from 'node-jose';
import { IDTokenClaims } from '../../middlewares/interfaces';
import { OIDCKeyService } from '../../../models/oidc-key/oidc-key.service';
import { ServerSettingsService } from '../../../models/server-settings/server-settings.service';
import { ServerSettings } from '../../../models/server-settings/server-settings.entity';
import { JWKSNotFound } from '../../filters/exceptions';

@Injectable()
export class IDTokenGrantService {
  settings: ServerSettings;

  constructor(
    private readonly oidcKeyService: OIDCKeyService,
    private readonly settingsService: ServerSettingsService,
  ) {}

  async grantIDToken(client, user, req, done) {
    try {
      if (!this.settings) this.settings = await this.settingsService.find();

      const issuedAt = Date.parse(new Date().toString()) / 1000;

      const claims: IDTokenClaims = {
        iss: this.settings.issuerUrl,
        aud: client.clientId,
        iat: Math.trunc(issuedAt),
        exp: Math.trunc(issuedAt) + 3600, // seconds * milliseconds
        sub: user.uuid,
        nonce: req.nonce,
      };

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
