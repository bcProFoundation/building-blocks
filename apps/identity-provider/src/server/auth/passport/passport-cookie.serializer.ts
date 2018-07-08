import { PassportSerializer } from '@nestjs/passport/dist/passport.serializer';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../models/user/user.service';

@Injectable()
export class CookieSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }
  async serializeUser(user: any, done: (err, user) => any) {
    // add user into array of users for multi-user per session?
    done(null, {
      id: user.id,
      email: user.email,
    });
  }
  deserializeUser(payload: any, done: (err, payload) => any): any {
    // remove user from array of users for logout one of the user?
    done(null, payload);
  }
}
