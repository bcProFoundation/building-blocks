import { Injectable } from '@nestjs/common';
import * as jose from 'node-jose';
import * as crypto from 'crypto';
import { IDTokenClaims } from '../../middlewares/interfaces';
import { OIDCKeyService } from '../../../auth/entities/oidc-key/oidc-key.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.interface';
import { JWKSNotFound } from '../../../common/filters/exceptions';
import { ConfigService, TOKEN_VALIDITY } from '../../../config/config.service';
import { User } from '../../../user-management/entities/user/user.interface';
import { Client } from '../../../client-management/entities/client/client.interface';
import {
  ROLES,
  SCOPE_EMAIL,
  SCOPE_PROFILE,
} from '../../../constants/app-strings';

@Injectable()
export class IDTokenGrantService {
  settings: ServerSettings;

  constructor(
    private readonly oidcKeyService: OIDCKeyService,
    private readonly settingsService: ServerSettingsService,
    private readonly configService: ConfigService,
  ) {}

  async grantIDToken(
    client: Client,
    user: User,
    req,
    done: (error?, idToken?) => void,
    accessToken?: string,
  ) {
    try {
      const signedToken = await this.generateIdToken(
        client.clientId,
        user,
        req.scope,
        accessToken,
        req.nonce,
      );
      return done(null, signedToken);
    } catch (error) {
      return done(error, null);
    }
  }

  async generateIdToken(
    clientId: string,
    user: User,
    scope: string[],
    accessToken?: string,
    nonce?: string,
  ) {
    if (!this.settings) this.settings = await this.settingsService.find();

    const issuedAt = Date.parse(new Date().toString()) / 1000;

    const claims: IDTokenClaims = {
      iss: this.settings.issuerUrl,
      aud: clientId,
      iat: Math.trunc(issuedAt),
      exp:
        Math.trunc(issuedAt) + Number(this.configService.get(TOKEN_VALIDITY)),
      sub: user.uuid,
      nonce,
    };

    if (scope.includes(ROLES)) claims.roles = user.roles;
    if (scope.includes(SCOPE_EMAIL)) claims.email = user.email;
    if (scope.includes(SCOPE_PROFILE)) claims.name = user.name;

    if (accessToken) {
      // Thanks https://github.com/mozilla/fxa-oauth-server/pull/598/files
      const atHash = this.generateTokenHash(accessToken);
      claims.at_hash = atHash;
    }

    const jwks = await this.oidcKeyService.find();

    // Pick first or only key from array
    const foundKey = jwks[0];
    if (!foundKey) {
      throw JWKSNotFound;
    }

    const signedToken = await jose.JWS.createSign(
      { alg: 'RS256', format: 'compact', kid: foundKey.keyPair.kid },
      foundKey.keyPair,
    )
      .update(JSON.stringify(claims))
      .final();
    return signedToken;
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
