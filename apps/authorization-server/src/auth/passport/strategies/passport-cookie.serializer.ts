import { Injectable } from '@nestjs/common';
import * as passport from 'passport';

@Injectable()
export class CookieSerializer {
  constructor() {
    passport.serializeUser((user, done) => this.serializeUser(user, done));
    passport.deserializeUser((payload, done) =>
      this.deserializeUser(payload, done),
    );
  }

  async serializeUser(user: any, done: (err, user) => any) {
    // add user into array of users for multi-user per session?
    done(null, {
      email: user.email,
      uuid: user.uuid,
      phone: user.phone,
      disabled: user.disabled,
      enable2fa: user.enable2fa,
      enablePasswordLess: user.enablePasswordLess,
      roles: user.roles,
    });
  }
  deserializeUser(payload: any, done: (err, payload) => any): any {
    // remove user from users for logout
    done(null, payload);
  }
}
