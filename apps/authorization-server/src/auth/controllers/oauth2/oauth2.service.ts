import { Injectable, HttpService } from '@nestjs/common';
import { i18n } from '../../../i18n/i18n.config';
import { ROLES } from '../../../constants/app-strings';
import { from, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientService } from '../../../client-management/entities/client/client.service';

export const PROFILE_USERINFO_ENDPOINT = '/profile/v1/userinfo';

@Injectable()
export class OAuth2Service {
  constructor(
    private readonly bearerTokenService: BearerTokenService,
    private readonly userService: UserService,
    private readonly settings: ServerSettingsService,
    private readonly http: HttpService,
    private readonly clientService: ClientService,
  ) {}

  async tokenRevoke(token) {
    const bearerToken = await this.bearerTokenService.findOne({
      accessToken: token,
    });
    if (bearerToken) {
      await bearerToken.remove();
      return { message: i18n.__('Bearer Token Revoked Successfully') };
    } else {
      return { message: i18n.__('Invalid Bearer Token') };
    }
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
      if (bearerToken.scope) {
        tokenData.scope = bearerToken.scope;
        if (bearerToken.scope.includes(ROLES) && bearerToken.user) {
          const user = await this.userService.findOne({
            uuid: bearerToken.user,
          });
          tokenData.roles = user.roles;
        }
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
                return of({
                  aud: token.client,
                  iss: settings.issuerUrl,
                  sub: user.uuid,
                  name: user.name,
                  email: user.email,
                  email_verified: user.email ? true : false,

                  // non-standard claims
                  roles: user.roles,
                });
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

  /**
   * unixTime Returns the stored time value in seconds since midnight, January 1, 1970 UTC.
   * @param date
   */
  unixTime(date: Date) {
    return Math.floor(date.valueOf() / 1000);
  }
}
