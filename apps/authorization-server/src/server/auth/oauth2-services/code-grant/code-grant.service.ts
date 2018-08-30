import { Injectable } from '@nestjs/common';
import { UserService } from '../../../models/user/user.service';
import { OAuth2TokenGeneratorService } from '../../middlewares/oauth2-token-generator.service';
import { AuthorizationCodeService } from '../../../models/authorization-code/authorization-code.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { ClientService } from '../../../models/client/client.service';

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
        email: user.email,
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
