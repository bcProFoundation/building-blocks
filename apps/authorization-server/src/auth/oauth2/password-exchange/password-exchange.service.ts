import { Injectable } from '@nestjs/common';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import { invalidScopeException } from '../../../common/filters/exceptions';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { CryptographerService } from '../../../common/services/cryptographer/cryptographer.service';

@Injectable()
export class PasswordExchangeService {
  constructor(
    private readonly authDataService: AuthDataService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly cryptographerService: CryptographerService,
    private readonly tokenGeneratorService: OAuth2TokenGeneratorService,
  ) {}

  async exchangePassword(client, username, password, scope, done) {
    if (!scope) return done(invalidScopeException);
    // Validate the client
    try {
      const localClient = await this.clientService.findOne({
        clientId: client.clientId,
      });
      if (!localClient) return done(null, false);
      if (localClient.clientSecret !== client.clientSecret)
        return done(null, false);
      // Validate the user
      const user = await this.userService.findOne({ email: username });
      if (!user) return done(null, false);
      const authData = await this.authDataService.findOne({
        uuid: user.password,
      });
      const validPassword = await this.cryptographerService.checkPassword(
        authData.password,
        password,
      );
      if (!validPassword) {
        return done(null, false);
      }

      // Validate Scopes
      const validScope = await this.tokenGeneratorService.getValidScopes(
        localClient,
        scope,
      );
      // Everything validated, return the token
      const {
        bearerToken,
        extraParams,
      } = await this.tokenGeneratorService.getBearerToken(
        localClient.clientId,
        user.uuid,
        validScope,
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
