import { Request } from 'express';
import passport from 'passport';

export interface OAuth2CodeStrategyOptions {
  passReqToCallback?: boolean;
}

export class PassportOAuth2CodeStrategy extends passport.Strategy {
  private verify: (...args) => unknown;
  private passReqToCallback: boolean;
  name = 'oauth2-code';

  constructor(
    options?: OAuth2CodeStrategyOptions,
    verify?: (...args) => unknown,
  ) {
    super();
    if (!verify) {
      throw new Error(
        'OAuth 2.0 authorization code strategy requires a verify function',
      );
    }

    passport.Strategy.call(this);
    this.name = 'oauth2-code';
    this.verify = verify;
    this.passReqToCallback = options.passReqToCallback;
  }

  authenticate(req: Request) {
    if (!req.body || !req.body.client_id) {
      return this.fail();
    }
    const clientCode = req.body.code;
    const clientId = req.body.client_id;
    const clientSecret = req.body.client_secret;
    const redirectURI = req.body.redirect_uri;

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
      this.verify(
        req,
        clientCode,
        clientId,
        clientSecret,
        redirectURI,
        verified,
      );
    } else {
      this.verify(clientCode, clientId, clientSecret, redirectURI, verified);
    }
  }
}
