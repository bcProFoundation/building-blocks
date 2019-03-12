import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import {
  invalidAuthorizationCodeException,
  invalidCodeChallengeException,
} from '../../../common/filters/exceptions';
import { AuthorizationCodeService } from '../../../auth/entities/authorization-code/authorization-code.service';
import { IDTokenGrantService } from '../id-token-grant/id-token-grant.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { AuthorizationCode } from '../../../auth/entities/authorization-code/authorization-code.interface';

@Injectable()
export class CodeExchangeService {
  constructor(
    private readonly authorizationCodeService: AuthorizationCodeService,
    private readonly tokenGeneratorService: OAuth2TokenGeneratorService,
    private readonly idTokenGrantService: IDTokenGrantService,
    private readonly userService: UserService,
  ) {}

  async exchangeCode(client, code, redirectUri, body, issued) {
    try {
      const localCode: AuthorizationCode = await this.authorizationCodeService.findOne(
        {
          code,
        },
      );

      if (!localCode) {
        issued(invalidAuthorizationCodeException);
      } else {
        const user = await this.userService.findOne({ uuid: localCode.user });
        const scope: string[] = localCode.scope;
        const [
          bearerToken,
          extraParams,
        ] = await this.tokenGeneratorService.getBearerToken(
          localCode.client,
          localCode.user,
          scope,
        );

        // For PKCE
        if (localCode.codeChallenge && localCode.codeChallengeMethod) {
          switch (localCode.codeChallengeMethod) {
            case 's256':
              // decode
              const codeVerifier = crypto
                .createHash('sha256')
                .update(body.code_verifier)
                .digest();

              const codeChallenge = codeVerifier
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');

              if (codeChallenge !== localCode.codeChallenge) {
                issued(invalidCodeChallengeException);
              }
              break;
            case 'plain':
              // direct compare
              if (body.code_verifier !== localCode.codeChallenge) {
                issued(invalidCodeChallengeException);
              }
              break;
          }
        }

        /**
         * OIDC scope: openid >
         * add name, family_name, given_name, middle_name, nickname,
         * preferred_username, profile, picture, website, gender,
         * birthdate, zoneinfo, locale, updated_at
         */
        if (scope.includes('openid')) {
          extraParams.id_token = await this.idTokenGrantService.generateIdToken(
            localCode.client,
            user,
            localCode.scope,
            bearerToken.accessToken,
            localCode.nonce,
          );
        }

        await this.authorizationCodeService.delete({ code: localCode.code });
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
