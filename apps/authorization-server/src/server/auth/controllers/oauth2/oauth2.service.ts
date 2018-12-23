import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { i18n } from '../../../i18n/i18n.config';
import { ROLES } from '../../../constants/app-strings';
import { UserService } from '../../../models/user/user.service';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
      bearerToken.remove();
    } else {
      throw new HttpException(
        i18n.__('Invalid Bearer Token'),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async tokenIntrospection(token) {
    const bearerToken = await this.bearerTokenService.findOne({
      accessToken: token,
    });

    let tokenData: any = { active: false };
    if (bearerToken) {
      const exp = new Date(
        bearerToken.creation.getTime() + bearerToken.expiresIn * 1000,
      );

      tokenData = {
        client_id: bearerToken.client,
        active: exp.valueOf() > new Date().valueOf(),
        exp: exp.valueOf(),
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
}
