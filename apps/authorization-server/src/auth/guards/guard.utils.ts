import { UnauthorizedException } from '@nestjs/common';
import passport from 'passport';

export const createPassportContext = (request, response) => (types, options) =>
  new Promise((resolve, reject) =>
    passport.authenticate(types, options, (err, user, info) => {
      try {
        if (options.passReqToCallback) {
          return resolve(options.callback(request, err, user, info));
        } else {
          return resolve(options.callback(err, user, info));
        }
      } catch (error) {
        reject(error);
      }
    })(request, response, resolve),
  );

export interface AuthGuardOptions {
  session?: boolean;
  property?: string;
  callback?: (...args) => unknown;
}

export const defaultOptions = {
  session: false,
  property: 'user',
  callback: (err, user, info) => {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  },
};

export interface RequestUser {
  email: string;
  uuid: string;
  phone: string;
  disabled: boolean;
  enable2fa: boolean;
  enablePasswordLess: boolean;
  roles: string[];
}

export function addSessionUser(request, reqUser) {
  if (!request.session.users) {
    request.session.users = [];
  }
  const existingUser = request.session.users.find(
    user => user.uuid === reqUser.uuid,
  );
  if (!existingUser) {
    request.session.users.push(reqUser);
  }
}
