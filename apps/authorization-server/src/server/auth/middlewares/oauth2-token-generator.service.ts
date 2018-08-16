import { Injectable } from '@nestjs/common';
import * as njwt from 'njwt';
import { CryptographerService } from '../../utilities/cryptographer.service';
import { BearerTokenService } from '../../models/bearer-token/bearer-token.service';
import { IDTokenClaims } from './interfaces';
import { Client } from '../../models/client/client.entity';
import { ScopeService } from '../../models/scope/scope.service';
import { invalidScopeException } from '../filters/exceptions';
import { Scope } from '../../models/scope/scope.entity';
import { BearerToken } from '../../models/bearer-token/bearer-token.entity';

@Injectable()
export class OAuth2TokenGeneratorService {
  constructor(
    private readonly cryptographerService: CryptographerService,
    private readonly bearerTokenService: BearerTokenService,
    private readonly scopeService: ScopeService,
  ) {}
  async getBearerToken(
    client,
    user,
    scope: Scope[],
    refresh = true,
    idToken = true,
  ) {
    const bearerToken = new BearerToken();
    bearerToken.accessToken = this.cryptographerService.getUid(64);
    bearerToken.redirectUri = client.redirectUri;
    bearerToken.client = client;
    bearerToken.creation = new Date();
    bearerToken.modified = bearerToken.creation;

    if (refresh)
      bearerToken.refreshToken = this.cryptographerService.getUid(64);
    if (user) bearerToken.user = user;

    const scopeStrings: string[] = scope.map(s => s.name);
    const extraParams: any = {
      // list of scopes to comma separated string
      scope: scopeStrings.toString(),
      expires_in: 3600,
    };

    bearerToken.scope = scope;
    bearerToken.expiresIn = extraParams.expires_in;

    const bToken = await this.bearerTokenService.save(bearerToken);

    // OIDC scope: openid
    if (idToken && scopeStrings.includes('openid')) {
      const claims: IDTokenClaims = {
        // iss: this.getAuthorizationServerUrl,
        aud: client.clientId,
        exp: Date.parse(bToken.creation) + extraParams.expires_in * 1000, // seconds * milliseconds
        iat: Date.parse(bToken.creation),
      };
      if (bToken.user) {
        claims.sub = bToken.user.uuid;
      }

      const jwt = njwt.create(claims, client.clientSecret);
      extraParams.id_token = jwt.compact();

      // OIDC scope: openid email > add email, verified_email

      /**
       * OIDC scope: openid profile >
       * add name, family_name, given_name, middle_name, nickname,
       * preferred_username, profile, picture, website, gender,
       * birthdate, zoneinfo, locale, updated_at
       */
    }

    return [bearerToken, extraParams];
  }

  async getValidScopes(client: Client, scope: string[]): Promise<Scope[]> {
    const allowedScopes =
      (client &&
        client.allowedScopes &&
        client.allowedScopes.map(clientScope => clientScope.name)) ||
      [];
    if (
      scope &&
      !scope.every(checkScope => allowedScopes.includes(checkScope))
    ) {
      throw invalidScopeException;
    }

    const requestScopes: Scope[] = [];
    for (const reqScope of scope) {
      requestScopes.push(await this.scopeService.findOne({ name: reqScope }));
    }

    return requestScopes;
  }
}
