import { Injectable } from '@nestjs/common';
import { i18n } from '../../../i18n/i18n.config';
import { ROLES } from '../../../constants/app-strings';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { UserService } from '../../../user-management/entities/user/user.service';

@Injectable()
export class OAuth2Service {
  constructor(
    private readonly bearerTokenService: BearerTokenService,
    private readonly userService: UserService,
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

      tokenData = {
        client_id: bearerToken.client,
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
    return from(this.userService.findOne({ uuid: req.user.user })).pipe(
      switchMap(user => {
        return of({
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          roles: user.roles,
        });
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
