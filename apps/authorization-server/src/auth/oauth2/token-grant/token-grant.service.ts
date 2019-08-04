import { Injectable } from '@nestjs/common';
import { UserService } from '../../../user-management/entities/user/user.service';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import {
  invalidUserException,
  invalidClientException,
} from '../../../common/filters/exceptions';

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
        uuid: user.uuid,
      });

      if (!localUser) throw invalidUserException;

      const localClient = await this.clientService.findOne({
        clientId: areq.clientID,
      });

      if (!localClient) throw invalidClientException;
      const scope = await this.tokenGeneratorService.getValidScopes(
        client,
        areq.scope,
      );
      const {
        bearerToken,
        extraParams,
      } = await this.tokenGeneratorService.getBearerToken(
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
