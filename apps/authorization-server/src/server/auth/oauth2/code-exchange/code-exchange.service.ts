import { Injectable } from '@nestjs/common';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import { invalidAuthorizationCodeException } from '../../../common/filters/exceptions';
import { AuthorizationCodeService } from '../../../auth/entities/authorization-code/authorization-code.service';

@Injectable()
export class CodeExchangeService {
  constructor(
    private readonly authorizationCodeService: AuthorizationCodeService,
    private readonly tokenGeneratorService: OAuth2TokenGeneratorService,
  ) {}

  async exchangeCode(client, code, redirectUri, body, issued) {
    try {
      const localCode = await this.authorizationCodeService.findOne({
        code,
      });

      if (!localCode) {
        issued(invalidAuthorizationCodeException);
      } else {
        const scope: string[] = localCode.scope;
        const [
          bearerToken,
          extraParams,
        ] = await this.tokenGeneratorService.getBearerToken(
          localCode.client,
          localCode.user,
          scope,
        );
        await this.authorizationCodeService.delete({ localCode });
        issued(
          null,
          bearerToken.accessToken,
          bearerToken.refreshToken,
          extraParams,
        );
      }
    } catch (error) {
      issued(error);
    }
  }
}
