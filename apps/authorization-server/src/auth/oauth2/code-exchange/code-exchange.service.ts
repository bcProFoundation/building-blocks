import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import crypto from 'crypto';
import {
  invalidAuthorizationCodeException,
  invalidCodeChallengeException,
} from '../../../common/filters/exceptions';
import { AuthorizationCodeService } from '../../../auth/entities/authorization-code/authorization-code.service';
import { IDTokenGrantService } from '../id-token-grant/id-token-grant.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { AuthorizationCode } from '../../../auth/entities/authorization-code/authorization-code.interface';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { TEN_NUMBER } from '../../../constants/app-strings';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.interface';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';
import { GenerateBearerTokenCommand } from '../../commands/generate-bearer-token/generate-bearer-token.command';

@Injectable()
export class CodeExchangeService {
  constructor(
    private readonly authorizationCodeService: AuthorizationCodeService,
    private readonly idTokenGrantService: IDTokenGrantService,
    private readonly userService: UserService,
    private readonly settings: ServerSettingsService,
    private readonly token: BearerTokenService,
    private readonly commandBus: CommandBus,
  ) {}

  async exchangeCode(client, code, redirectUri, body, issued) {
    try {
      const localCode: AuthorizationCode =
        await this.authorizationCodeService.findOne({ code });

      if (!localCode) {
        issued(invalidAuthorizationCodeException);
        return;
      } else {
        // Check code expiry
        let settings = {
          authCodeExpiresInMinutes: TEN_NUMBER,
        } as ServerSettings;

        try {
          settings = await this.settings.find();
        } catch (error) {}

        const expiry = localCode.creation;
        expiry.setMinutes(
          expiry.getMinutes() + settings.authCodeExpiresInMinutes,
        );

        if (new Date() > expiry) {
          this.authorizationCodeService.delete({ code: localCode.code });
          issued(invalidAuthorizationCodeException);
          return;
        }

        // Generate Bearer Token
        const user = await this.userService.findOne({ uuid: localCode.user });
        const scope: string[] = localCode.scope;
        const { bearerToken, extraParams } = await this.commandBus.execute(
          new GenerateBearerTokenCommand(
            localCode.client,
            localCode.user,
            scope,
          ),
        );

        // For PKCE
        if (localCode.codeChallenge && localCode.codeChallengeMethod) {
          switch (localCode.codeChallengeMethod) {
            case 's256':
              if (!body.code_verifier) {
                await this.authorizationCodeService.delete({
                  code: localCode.code,
                });
                await this.token.remove(bearerToken);
                issued(invalidCodeChallengeException);
                return;
              }
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
                await this.authorizationCodeService.delete({
                  code: localCode.code,
                });
                await this.token.remove(bearerToken);
                issued(invalidCodeChallengeException);
                return;
              }
              break;
            case 'plain':
              // direct compare
              if (body.code_verifier !== localCode.codeChallenge) {
                await this.authorizationCodeService.delete({
                  code: localCode.code,
                });
                await this.token.remove(bearerToken);
                issued(invalidCodeChallengeException);
                return;
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
