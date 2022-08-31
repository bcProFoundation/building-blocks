import { Strategy } from 'passport';
import { addSessionUser } from '../../guards/guard.utils';

export interface OAuth2ClientOptions {
  badRequestMessage?: string;
  failureRedirect?: string;
}

export const STATE = 'state';
export const SESSION = 'session';

export class PassportOAuth2ClientStrategy extends Strategy {
  protected verify: (...args) => any | void;
  name = 'oauth2-client';

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
      const users = req.session?.users;
      req.logIn(user, () => {
        req.session.users = users;
        addSessionUser(req, {
          uuid: user.uuid,
          email: user.email,
          phone: user.phone,
        });
      });
      self.success(user, info);
    }

    try {
      this.verify(req, storedState, verified);
    } catch (ex) {
      return self.error(ex);
    }
  }
}
