import { Strategy } from 'passport';

export interface OAuth2ClientOptions {
  badRequestMessage?: string;
  failureRedirect?: string;
}

export const STATE = 'state';
export const SESSION = 'session';

export class PassportOAuth2ClientStrategy extends Strategy {
  protected verify: (...args) => any | void;
  constructor(verify: (...args) => any | void) {
    super();
    if (!verify) {
      throw new TypeError('OAuth2Client requires a verify callback');
    }

    this.name = 'oauth2-client';
    this.verify = verify;
  }

  authenticate(req, options?: OAuth2ClientOptions) {
    const self = this;
    const state = req.query.state;
    let storedState;
    if (state) {
      storedState = req[SESSION].state;
    }
    function verified(err, user, confirmationURL, info) {
      if (err || !user) {
        if (info && info.state) {
          req[SESSION].state = info.state;
        }
        return self.redirect(
          confirmationURL || options.failureRedirect || '/login',
        );
      }
      req.user = user;
      req.logIn(user, () => {});
      self.success(user, info);
    }

    try {
      this.verify(req, storedState, verified);
    } catch (ex) {
      return self.error(ex);
    }
  }
}
