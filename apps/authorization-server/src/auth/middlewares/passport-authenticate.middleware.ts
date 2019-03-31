import { Injectable, NestMiddleware } from '@nestjs/common';
import passport = require('passport');

@Injectable()
export class PassportAuthenticateMiddleware implements NestMiddleware {
  public use(request, response, next: () => void) {
    passport.authenticate(['oauth2-code', 'oauth2-client-password'], {
      session: false,
    })(request, response, next);
  }
}
