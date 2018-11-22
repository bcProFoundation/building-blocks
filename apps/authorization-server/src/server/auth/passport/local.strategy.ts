import { Strategy } from 'passport-local';
import { AuthService } from '../controllers/auth/auth.service';
import { PassportStrategy } from './passport.strategy';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ACCOUNTS_ROUTE } from '../../constants/app-strings';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      passReqToCallback: true,
      successRedirect: ACCOUNTS_ROUTE,
    });
  }

  async validate(req, username, password, done: (err, user) => any) {
    const code = lookup(req.body, 'code') || lookup(req.query, 'code');
    await this.authService
      .logIn(username.toLowerCase(), password, code)
      .then(user => done(null, user))
      .catch(err => done(err, false));
  }
}

function lookup(obj, field) {
  if (!obj) {
    return null;
  }
  const chain = field
    .split(']')
    .join('')
    .split('[');
  for (let i = 0, len = chain.length; i < len; i++) {
    const prop = obj[chain[i]];
    if (typeof prop === 'undefined') {
      return null;
    }
    if (typeof prop !== 'object') {
      return prop;
    }
    obj = prop;
  }
  return null;
}

export const callback = (err, user, info) => {
  if (typeof info !== 'undefined') {
    throw new UnauthorizedException(info.message);
  } else if (err || !user) {
    throw err || new UnauthorizedException();
  }
  return user;
};
