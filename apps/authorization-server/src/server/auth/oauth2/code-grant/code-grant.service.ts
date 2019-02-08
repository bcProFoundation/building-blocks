import { Injectable } from '@nestjs/common';
import { UserService } from '../../../user-management/entities/user/user.service';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import { AuthorizationCodeService } from '../../../auth/entities/authorization-code/authorization-code.service';
import { CryptographerService } from '../../../common/cryptographer.service';
import { ClientService } from '../../../client-management/entities/client/client.service';

@Injectable()
export class CodeGrantService {
  constructor(
    private readonly userService: UserService,
    private readonly clientService: ClientService,
    private readonly tokenGeneratorService: OAuth2TokenGeneratorService,
    private readonly authorizationCodeService: AuthorizationCodeService,
    private readonly cryptographerService: CryptographerService,
  ) {}

  async grantCode(client, redirectUri, user, ares, areq, done) {
    try {
      const code = this.cryptographerService.getUid(16);
      const localClient = await this.clientService.findOne({
        clientId: areq.clientID,
      });
      const localUser = await this.userService.findOne({
        uuid: user.uuid,
      });
      const scope = await this.tokenGeneratorService.getValidScopes(
        localClient,
        areq.scope,
      );
      await this.authorizationCodeService.save({
        code,
        client: localClient.clientId,
        redirectUri,
        user: localUser.uuid,
        scope,
      });
      done(null, code);
    } catch (error) {
      done(error, null);
    }
  }
}
