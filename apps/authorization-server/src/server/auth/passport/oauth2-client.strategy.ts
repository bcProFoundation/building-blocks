import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from './passport.strategy';
import { PassportOAuth2ClientStrategy } from './oauth2-oidc/passport-oauth2-client.strategy';
import { Request } from 'express';
import { SocialLoginManagementService } from '../controllers/social-login/social-login-management.service';
import { bindCallback } from 'rxjs';

@Injectable()
export class OAuth2ClientStrategy extends PassportStrategy(
  PassportOAuth2ClientStrategy,
) {
  constructor(
    private readonly socialLoginService: SocialLoginManagementService,
  ) {
    super();
  }

  validate(
    req: Request,
    storedState: string,
    done: (err?, user?, confirmationURL?, info?) => any,
  ) {
    try {
      const code = req.query.code;
      const socialLogin = req.params.socialLogin;
      const redirect = req.query.redirect;
      const state = req.query.state;
      this.socialLoginService
        .requestTokenAndProfile(
          code,
          state,
          socialLogin,
          redirect,
          storedState,
          bindCallback(done),
        )
        .subscribe({
          next: data => done(null, data),
          error: err => done(err, null),
        });
    } catch (error) {
      done(error, null);
    }
  }
}

export const callback = (err, user, confirmationURL, info) => {
  if (typeof info !== 'undefined') {
    throw new UnauthorizedException(info.message);
  } else if (err || !user) {
    throw new UnauthorizedException();
  }
  return user;
};
