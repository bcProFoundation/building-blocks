import { Request } from 'express';
import passport from 'passport';

export interface LocalStrategyOptions {
  usernameField?: string;
  passwordField?: string;
  badRequestMessage?: string | number;
  passReqToCallback?: boolean;
}
export class PassportLocalStrategy extends passport.Strategy {
  private usernameField: string;
  private passwordField: string;
  private verify: (...args) => unknown;
  private passReqToCallback: boolean;
  name = 'local';

  constructor(options?: LocalStrategyOptions, verify?: (...args) => unknown) {
    super();
    if (!verify) {
      throw new TypeError('LocalStrategy requires a verify callback');
    }
    this.usernameField = options?.usernameField || 'username';
    this.passwordField = options?.passwordField || 'password';
    passport.Strategy.call(this);
    this.name = 'local';
    this.verify = verify;
    this.passReqToCallback = options?.passReqToCallback;
  }

  authenticate(req: Request, options: LocalStrategyOptions) {
    options = options || {};
    const username = req.body[this.usernameField];
    const password = req.body[this.passwordField];

    if (!username || !password) {
      return this.fail(options.badRequestMessage || 'Missing credentials', 400);
    }

    const verified = (err, user, info) => {
      if (err) {
        return this.error(err);
      }
      if (!user) {
        return this.fail(info);
      }
      this.success(user, info);
    };

    try {
      if (this.passReqToCallback) {
        this.verify(req, username, password, verified);
      } else {
        this.verify(username, password, verified);
      }
    } catch (ex) {
      return this.error(ex);
    }
  }
}
