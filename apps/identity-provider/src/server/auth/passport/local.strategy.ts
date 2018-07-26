import { Strategy } from 'passport-local';
import { AuthService } from '../controllers/auth/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ACCOUNTS_ROUTE } from '../../constants/locations';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: false,
      successRedirect: ACCOUNTS_ROUTE,
    });
  }

  async validate(email, password, done: (err, user) => any) {
    await this.authService
      .logIn(email, password)
      .then(user => done(null, user))
      .catch(err => done(err, false));
  }
}

export const callback = (err, user, info) => {
  if (typeof info !== 'undefined') {
    throw new UnauthorizedException(info.message);
  } else if (err || !user) {
    throw err || new UnauthorizedException();
  }
  return user;
};
