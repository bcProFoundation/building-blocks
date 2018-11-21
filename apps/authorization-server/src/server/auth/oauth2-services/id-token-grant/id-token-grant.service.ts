import { Injectable } from '@nestjs/common';
import * as jose from 'node-jose';
import { IDTokenClaims } from '../../middlewares/interfaces';
import { OIDCKeyService } from '../../../models/oidc-key/oidc-key.service';
import { ServerSettingsService } from '../../../models/server-settings/server-settings.service';
import { ServerSettings } from '../../../models/interfaces/server-settings.interface';
import { JWKSNotFound } from '../../filters/exceptions';
import { ConfigService } from '../../../config/config.service';
import * as crypto from 'crypto';

@Injectable()
export class IDTokenGrantService {
  settings: ServerSettings;

  constructor(
    private readonly oidcKeyService: OIDCKeyService,
    private readonly settingsService: ServerSettingsService,
    private readonly configService: ConfigService,
  ) {}

  async grantIDToken(client, user, req, done, accessToken?: string) {
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
      if (accessToken) {
        // Thanks https://github.com/mozilla/fxa-oauth-server/pull/598/files
        const atHash = this.generateTokenHash(accessToken);
        claims.at_hash = atHash;
      }

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

  generateTokenHash(accessTokenBuf) {
    const hash = this.encryptHash(accessTokenBuf.toString('ascii'));
    return this.base64URLEncode(hash.slice(0, hash.length / 2));
  }

  base64URLEncode(buf) {
    return buf
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  encryptHash(hash) {
    const value = Buffer.from(hash, 'ascii');
    const sha = crypto.createHash('sha256');
    sha.update(value);
    return sha.digest();
  }
}
