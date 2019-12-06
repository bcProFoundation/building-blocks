import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { CryptographerService } from '../../../common/services/cryptographer/cryptographer.service';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';
import {
  invalidScopeException,
  invalidClientException,
} from '../../../common/filters/exceptions';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { Client } from '../../../client-management/entities/client/client.interface';
import { BearerToken } from '../../entities/bearer-token/bearer-token.interface';
import { ConfigService, TOKEN_VALIDITY } from '../../../config/config.service';
import { BearerTokenAddedEvent } from '../../../auth/events/bearer-token-added/bearer-token-added.event';

@Injectable()
export class OAuth2TokenGeneratorService extends AggregateRoot {
  constructor(
    private readonly cryptographerService: CryptographerService,
    private readonly bearerTokenService: BearerTokenService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

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
  ): Promise<{ bearerToken: BearerToken; extraParams: any }> {
    const localClient = await this.clientService.findOne({ clientId: client });
    if (!localClient) throw invalidClientException;

    const localUser = await this.userService.findOne({ uuid: user });
    const bearerToken = {} as BearerToken;
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
      expires_in: Number(this.configService.get(TOKEN_VALIDITY)),
    };

    bearerToken.scope = scope;
    bearerToken.expiresIn = extraParams.expires_in;

    await this.bearerTokenService.save(bearerToken);

    this.apply(new BearerTokenAddedEvent(bearerToken));

    return { bearerToken, extraParams };
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
