import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from './passport.strategy';
import { PassportOAuth2ClientStrategy } from './passport-oauth2-client.strategy';
import { Request } from 'express';
import { bindCallback } from 'rxjs';
import { SocialLoginCallbackService } from '../../aggregates/social-login-callback/social-login-callback.service';

@Injectable()
export class OAuth2ClientStrategy extends PassportStrategy(
  PassportOAuth2ClientStrategy,
) {
  constructor(
    private readonly socialLoginCallback: SocialLoginCallbackService,
  ) {
    super();
  }

  validate(
    req: Request,
    storedState: string,
    done: (err?, user?, confirmationURL?, info?) => any,
  ) {
    try {
      const code = req.query.code as string;
      const socialLogin = req.params.socialLogin;
      const redirect = req.query.redirect as string;
      const state = req.query.state as string;
      this.socialLoginCallback
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
      return done(error, null);
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
