import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import { invalidScopeException } from '../../../common/filters/exceptions';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { GenerateBearerTokenCommand } from '../../commands/generate-bearer-token/generate-bearer-token.command';

@Injectable()
export class ClientCredentialExchangeService {
  constructor(
    private readonly clientService: ClientService,
    private readonly tokenGeneratorService: OAuth2TokenGeneratorService,
    private readonly commandBus: CommandBus,
  ) {}

  async exchangeClientCredentials(client, scope, done) {
    if (!scope) return done(invalidScopeException);
    // Validate the client
    try {
      const localClient = await this.clientService.findOne({
        clientId: client.clientId,
      });
      if (!localClient) return done(null, false);
      if (localClient.clientSecret !== client.clientSecret) {
        return done(null, false);
      }

      // Validate Scope
      const validScope = await this.tokenGeneratorService.getValidScopes(
        localClient,
        scope,
      );
      // Everything validated, return the token
      // Pass in a null for user id since there is no user with this grant type
      const { bearerToken, extraParams } = await this.commandBus.execute(
        new GenerateBearerTokenCommand(
          client.clientId,
          null,
          validScope,
          true,
          false,
        ),
      );

      return done(
        null,
        bearerToken.accessToken,
        bearerToken.refreshToken,
        extraParams,
      );
    } catch (error) {
      return done(error);
    }
  }
}
