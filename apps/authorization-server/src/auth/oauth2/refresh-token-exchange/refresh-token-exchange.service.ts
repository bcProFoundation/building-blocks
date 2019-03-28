import { Injectable } from '@nestjs/common';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { Client } from '../../../client-management/entities/client/client.interface';

@Injectable()
export class RefreshTokenExchangeService {
  constructor(
    private readonly clientService: ClientService,
    private readonly tokenGeneratorService: OAuth2TokenGeneratorService,
    private readonly bearerTokenService: BearerTokenService,
  ) {}

  async exchangeRefreshToken(client, refreshToken, done) {
    try {
      // Validate Refresh Token
      const localRefreshToken = await this.bearerTokenService.findOne({
        refreshToken,
      });
      if (!localRefreshToken) done(null, false);

      // Validate Client
      let localClient: Client;
      if (client) {
        localClient = await this.clientService.findOne({
          clientId: client.clientId,
        });
        if (!localClient) done(null, false);
      } else {
        localClient = await this.clientService.findOne({
          uuid: localRefreshToken.client,
        });
      }

      // Validate Scopes
      const scope = await this.tokenGeneratorService.getValidScopes(
        localClient,
        localRefreshToken.scope,
      );

      // Everything validated, return the token
      const [
        bearerToken,
        extraParams,
      ] = await this.tokenGeneratorService.getBearerToken(
        client.clientId,
        localRefreshToken.user,
        scope,
        true,
      );
      return done(
        null,
        bearerToken.accessToken,
        bearerToken.refreshToken,
        extraParams,
      );
    } catch (error) {
      done(error);
    }
  }
}
