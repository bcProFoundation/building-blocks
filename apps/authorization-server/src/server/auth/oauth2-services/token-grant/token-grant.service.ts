import { Injectable } from '@nestjs/common';
import { UserService } from '../../../models/user/user.service';
import { OAuth2TokenGeneratorService } from '../../middlewares/oauth2-token-generator.service';
import { ClientService } from '../../../models/client/client.service';

@Injectable()
export class TokenGrantService {
  accessToken: string;

  constructor(
    private readonly userService: UserService,
    private readonly clientService: ClientService,
    private readonly tokenGeneratorService: OAuth2TokenGeneratorService,
  ) {}

  async grantToken(client, user, ares, areq, done) {
    try {
      const localUser = await this.userService.findOne({
        email: user.email,
      });
      const localClient = await this.clientService.findOne({
        clientId: areq.clientID,
      });
      const scope = await this.tokenGeneratorService.getValidScopes(
        client,
        areq.scope,
      );
      const [
        bearerToken,
        extraParams,
      ] = await this.tokenGeneratorService.getBearerToken(
        localClient.clientId,
        localUser.uuid,
        scope,
        false,
      );
      this.accessToken = bearerToken.accessToken;
      return done(null, bearerToken.accessToken, extraParams);
    } catch (error) {
      return done(error);
    }
  }

  getAccessToken() {
    return this.accessToken;
  }
}
