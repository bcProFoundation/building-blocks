import { PassportSerializer } from '@nestjs/passport/dist/passport.serializer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CookieSerializer extends PassportSerializer {
  constructor() {
    super();
  }
  async serializeUser(user: any, done: (err, user) => any) {
    // add user into array of users for multi-user per session?
    done(null, {
      email: user.email,
      uuid: user.uuid,
      phone: user.phone,
      disabled: user.disabled,
      enable2fa: user.enable2fa,
    });
  }
  deserializeUser(payload: any, done: (err, payload) => any): any {
    // remove user from array of users for logout one of the user?
    done(null, payload);
  }
}
