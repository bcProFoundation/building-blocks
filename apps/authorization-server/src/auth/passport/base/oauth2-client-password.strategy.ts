import { Request } from 'express';
import passport from 'passport';

export interface OAuth2ClientPasswordStrategyOptions {
  passReqToCallback?: boolean;
}

export class PassportOAuth2ClientPasswordStrategy extends passport.Strategy {
  private verify: (...args) => unknown;
  private passReqToCallback: boolean;
  name = 'oauth2-client-password';

  constructor(
    options?: OAuth2ClientPasswordStrategyOptions,
    verify?: (...args) => unknown,
  ) {
    super();
    passport.Strategy.call(this);
    this.name = 'oauth2-client-password';
    this.verify = verify;
    this.passReqToCallback = options.passReqToCallback;
  }

  authenticate(req: Request) {
    if (!req.body || !req.body.client_id || !req.body.client_secret) {
      return this.fail();
    }

    const clientId = req.body.client_id;
    const clientSecret = req.body.client_secret;

    const verified = (err, client, info) => {
      if (err) {
        return this.error(err);
      }
      if (!client) {
        return this.fail();
      }
      this.success(client, info);
    };

    if (this.passReqToCallback) {
      this.verify(req, clientId, clientSecret, verified);
    } else {
      this.verify(clientId, clientSecret, verified);
    }
  }
}
