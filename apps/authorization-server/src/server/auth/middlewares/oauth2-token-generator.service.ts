import { Injectable } from '@nestjs/common';
import * as njwt from 'njwt';
import { CryptographerService } from '../../utilities/cryptographer.service';
import { BearerTokenService } from '../../models/bearer-token/bearer-token.service';
import { IDTokenClaims } from './interfaces';
import { Client } from '../../models/client/client.entity';
import {
  invalidScopeException,
  invalidClientException,
} from '../filters/exceptions';
import { BearerToken } from '../../models/bearer-token/bearer-token.entity';
import { ClientService } from '../../models/client/client.service';
import { UserService } from '../../models/user/user.service';

@Injectable()
export class OAuth2TokenGeneratorService {
  constructor(
    private readonly cryptographerService: CryptographerService,
    private readonly bearerTokenService: BearerTokenService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
  ) {}

  /**
   * Generates Bearer token as per the parameters passed,
   * @param client clientId to be stored on Bearer Token
   * @param user user's uuid to be stored on Bearer Token
   * @param scope scopes to be stored on Bearer Token
   * @param refresh if set, adds Refresh Token on Bearer Token
   * @param idToken if set adds id_token to response
   */
  async getBearerToken(
    client: string,
    user: string,
    scope: string[],
    refresh: boolean = true,
    idToken: boolean = true,
  ) {
    const localClient = await this.clientService.findOne({ clientId: client });
    if (!localClient) throw invalidClientException;

    const localUser = await this.userService.findOne({ uuid: user });

    const bearerToken = new BearerToken();
    bearerToken.accessToken = this.cryptographerService.getUid(64);
    bearerToken.redirectUris = localClient.redirectUris;

    // Saves client by clientId NOT uuid
    bearerToken.client = localClient.clientId;

    bearerToken.creation = new Date();
    bearerToken.modified = bearerToken.creation;

    if (refresh)
      bearerToken.refreshToken = this.cryptographerService.getUid(64);
    if (user) bearerToken.user = localUser.uuid;

    const extraParams: any = {
      // list of scopes to space separated string
      scope: scope.join(' '),
      expires_in: 3600,
    };

    bearerToken.scope = scope;
    bearerToken.expiresIn = extraParams.expires_in;

    await this.bearerTokenService.save(bearerToken);

    //   /**
    //    * OIDC scope: openid profile >
    //    * add name, family_name, given_name, middle_name, nickname,
    //    * preferred_username, profile, picture, website, gender,
    //    * birthdate, zoneinfo, locale, updated_at
    //    */
    // }

    return [bearerToken, extraParams];
  }

  async getValidScopes(client: Client, scope: string[]): Promise<string[]> {
    const allowedScopes = (client && client.allowedScopes) || [];
    if (
      !scope ||
      (scope && !scope.every(checkScope => allowedScopes.includes(checkScope)))
    ) {
      throw invalidScopeException;
    }

    return scope;
  }
}
