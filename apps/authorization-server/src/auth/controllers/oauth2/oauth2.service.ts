import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  ROLES,
  SCOPE_EMAIL,
  SCOPE_PROFILE,
  SCOPE_PHONE,
} from '../../../constants/app-strings';
import { forkJoin, from, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { BearerToken } from '../../entities/bearer-token/bearer-token.interface';
import { User } from '../../../user-management/entities/user/user.interface';
import { CommandBus } from '@nestjs/cqrs';
import { RemoveBearerTokenCommand } from '../../commands/remove-bearer-token/remove-bearer-token.command';
import { UserClaimService } from '../../entities/user-claim/user-claim.service';
import { IDTokenClaims } from '../../middlewares/interfaces';

export const PROFILE_USERINFO_ENDPOINT = '/profile/v1/userinfo';

@Injectable()
export class OAuth2Service {
  constructor(
    private readonly bearerTokenService: BearerTokenService,
    private readonly userService: UserService,
    private readonly settings: ServerSettingsService,
    private readonly http: HttpService,
    private readonly clientService: ClientService,
    private readonly userClaimService: UserClaimService,
    private readonly commandBus: CommandBus,
  ) {}

  async tokenRevoke(token) {
    return await this.commandBus.execute(new RemoveBearerTokenCommand(token));
  }

  async tokenIntrospection(token) {
    const bearerToken = await this.bearerTokenService.findOne({
      accessToken: token,
    });

    let tokenData: any = { active: false };
    if (bearerToken) {
      /**
       * exp Integer timestamp, measured in the number of seconds
       * since January 1 1970 UTC, indicating when this token will expire
       * https://tools.ietf.org/html/rfc7662#section-2.2
       */
      const exp = new Date(
        bearerToken.creation.getTime() + bearerToken.expiresIn * 1000,
      );

      const client = await this.clientService.findOne({
        clientId: bearerToken.client,
      });
      tokenData = {
        client_id: bearerToken.client,
        trusted_client: client.isTrusted,
        active: this.unixTime(exp) > this.unixTime(new Date()),
        exp: this.unixTime(exp),
      };

      if (bearerToken.user) tokenData.sub = bearerToken.user;

      const user = await this.userService.findOne({
        uuid: tokenData.sub,
      });

      if (bearerToken.scope) {
        tokenData.scope = bearerToken.scope;
        tokenData = this.appendUserInfo(user, bearerToken, tokenData);
      }
    }
    return tokenData;
  }

  getProfile(req) {
    const accessToken = this.getAccessToken(req);
    const uuid = req.user.user;
    return from(this.settings.find()).pipe(
      switchMap(settings => {
        if (!settings.identityProviderClientId) {
          return this.observeLocalProfile(uuid, accessToken);
        } else {
          return this.observeIdentityProviderProfile(
            settings.identityProviderClientId,
            uuid,
            accessToken,
          );
        }
      }),
    );
  }

  getAccessToken(request) {
    if (!request.headers.authorization) {
      if (!request.query.access_token) return null;
    }
    return (
      request.query.access_token ||
      request.headers.authorization.split(' ')[1] ||
      null
    );
  }

  observeLocalProfile(uuid: string, accessToken: string) {
    return from(this.settings.find()).pipe(
      switchMap(settings => {
        return from(this.bearerTokenService.findOne({ accessToken })).pipe(
          switchMap(token => {
            return from(this.userService.findOne({ uuid })).pipe(
              switchMap(user => {
                const claims: IDTokenClaims = {
                  aud: token.client,
                  iss: settings.issuerUrl,
                  sub: user.uuid,
                };

                if (token.scope.includes(ROLES)) {
                  claims.roles = user.roles;
                }
                if (token.scope.includes(SCOPE_EMAIL)) {
                  claims.email = user.email;
                  claims.email_verified = user.isEmailVerified;
                }
                if (token.scope.includes(SCOPE_PROFILE)) {
                  claims.name = user.name;
                }
                if (token.scope.includes(SCOPE_PHONE) && user.phone) {
                  claims.phone_number = user.phone;
                  claims.phone_number_verified = !user.unverifiedPhone;
                }

                return forkJoin({
                  requestClaims: of(claims),
                  userClaims: from(
                    this.userClaimService.find({
                      scope: { $in: token.scope },
                      uuid: user.uuid,
                    }),
                  ),
                });
              }),
              switchMap(({ requestClaims, userClaims }) => {
                const claims = requestClaims;

                if (userClaims && userClaims.length > 0) {
                  userClaims.forEach(claim => {
                    claims[claim.name] = claim.value;
                  });
                }
                return of(claims);
              }),
            );
          }),
        );
      }),
    );
  }

  observeIdentityProviderProfile(
    identityProviderClientId: string,
    uuid: string,
    accessToken: string,
  ) {
    return from(
      this.clientService.findOne({
        clientId: identityProviderClientId,
      }),
    ).pipe(
      switchMap(client => {
        let parsedUrl: URL;
        let url: string = '';
        try {
          parsedUrl = new URL(client.redirectUris[0]);
          url = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
          if (parsedUrl.port) url += `:${parsedUrl.port}`;
          return this.http
            .get(url + PROFILE_USERINFO_ENDPOINT, {
              headers: {
                Authorization: 'Bearer ' + accessToken,
              },
            })
            .pipe(
              catchError(error => of({ data: {} })),
              map(res => res.data),
            );
        } catch (error) {
          return of({});
        }
      }),
      switchMap(userInfo => {
        return this.observeLocalProfile(uuid, accessToken).pipe(
          map(localUser => {
            return {
              ...localUser,
              ...userInfo,
            };
          }),
        );
      }),
    );
  }

  appendUserInfo(
    user: User,
    bearerToken: BearerToken,
    tokenData: IDTokenClaims,
  ) {
    if (user) {
      if (bearerToken.scope.includes(ROLES)) {
        tokenData.roles = user.roles;
      }

      if (bearerToken.scope.includes(SCOPE_EMAIL)) {
        tokenData.email = user.email;
        tokenData.email_verified = user.isEmailVerified;
      }

      if (bearerToken.scope.includes(SCOPE_PROFILE)) {
        tokenData.name = user.name;
      }

      if (bearerToken.scope.includes(SCOPE_PHONE) && user.phone) {
        tokenData.phone_number = user.phone;
        tokenData.phone_number_verified = !user.unverifiedPhone;
      }
    }

    return tokenData;
  }

  /**
   * unixTime Returns the stored time value in seconds since midnight, January 1, 1970 UTC.
   * @param date
   */
  unixTime(date: Date) {
    return Math.floor(date.valueOf() / 1000);
  }
}
