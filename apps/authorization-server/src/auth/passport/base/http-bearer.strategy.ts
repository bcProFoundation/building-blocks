import { Request } from 'express';
import passport from 'passport';

export interface HttpBearerStrategyOptions {
  scope?: string | string[];
  passReqToCallback?: boolean;
  realm?: string;
}
export class PassportHttpBearerStrategy extends passport.Strategy {
  private verify: (...args) => unknown;
  private passReqToCallback: boolean;
  private scope: string[];
  private realm: string;
  name = 'bearer';

  constructor(
    options?: HttpBearerStrategyOptions,
    verify?: (...args) => unknown,
  ) {
    super();
    if (!verify) {
      throw new TypeError('HTTPBearerStrategy requires a verify callback');
    }

    passport.Strategy.call(this);
    this.name = 'bearer';
    this.verify = verify;
    this.realm = options.realm || 'Users';
    if (options.scope) {
      this.scope = Array.isArray(options.scope)
        ? options.scope
        : [options.scope];
    }
    this.passReqToCallback = options.passReqToCallback;
  }

  authenticate(req: Request) {
    let token;

    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        const scheme = parts[0],
          credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      } else {
        return this.fail(400);
      }
    }

    if (req.body && req.body.access_token) {
      if (token) {
        return this.fail(400);
      }
      token = req.body.access_token;
    }

    if (req.query && req.query.access_token) {
      if (token) {
        return this.fail(400);
      }
      token = req.query.access_token;
    }

    if (!token) {
      return this.fail(this.challenge());
    }

    const verified = (err, user, info) => {
      if (err) {
        return this.error(err);
      }
      if (!user) {
        if (typeof info == 'string') {
          info = { message: info };
        }
        info = info || {};
        return this.fail(this.challenge('invalid_token', info.message));
      }
      this.success(user, info);
    };

    if (this.passReqToCallback) {
      this.verify(req, token, verified);
    } else {
      this.verify(token, verified);
    }
  }

  challenge(code?: string, desc?: string, uri?: string) {
    let challenge = 'Bearer realm="' + this.realm + '"';
    if (this.scope) {
      challenge += ', scope="' + this.scope.join(' ') + '"';
    }
    if (code) {
      challenge += ', error="' + code + '"';
    }
    if (desc && desc.length) {
      challenge += ', error_description="' + desc + '"';
    }
    if (uri && uri.length) {
      challenge += ', error_uri="' + uri + '"';
    }

    return challenge;
  }
}
