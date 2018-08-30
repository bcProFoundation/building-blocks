import { Injectable } from '@nestjs/common';
import { OAuth2TokenGeneratorService } from '../../middlewares/oauth2-token-generator.service';
import { invalidScopeException } from '../../filters/exceptions';
import { ClientService } from '../../../models/client/client.service';

@Injectable()
export class ClientCredentialExchangeService {
  constructor(
    private readonly clientService: ClientService,
    private readonly tokenGeneratorService: OAuth2TokenGeneratorService,
  ) {}

  async exchangeClientCredentials(client, scope, done) {
    if (!scope) done(invalidScopeException);
    // Validate the client
    try {
      const c = await this.clientService.findOne({
        clientId: client.clientId,
      });
      if (!c) done(null, false);
      if (c.clientSecret !== client.clientSecret) return done(null, false);
      // Validate Scope
      const validScope = await this.tokenGeneratorService.getValidScopes(
        c,
        scope,
      );
      // Everything validated, return the token
      // Pass in a null for user id since there is no user with this grant type
      const [
        bearerToken,
        extraParams,
      ] = await this.tokenGeneratorService.getBearerToken(
        client.clientId,
        null,
        validScope,
        true,
        false,
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
