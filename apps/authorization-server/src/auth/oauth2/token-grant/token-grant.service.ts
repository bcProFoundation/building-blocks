import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserService } from '../../../user-management/entities/user/user.service';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import {
  invalidUserException,
  invalidClientException,
} from '../../../common/filters/exceptions';
import { GenerateBearerTokenCommand } from '../../commands/generate-bearer-token/generate-bearer-token.command';

@Injectable()
export class TokenGrantService {
  accessToken: string;

  constructor(
    private readonly userService: UserService,
    private readonly clientService: ClientService,
    private readonly tokenGeneratorService: OAuth2TokenGeneratorService,
    private readonly commandBus: CommandBus,
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
      const { bearerToken, extraParams } = await this.commandBus.execute(
        new GenerateBearerTokenCommand(
          localClient.clientId,
          localUser.uuid,
          scope,
          false,
        ),
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
