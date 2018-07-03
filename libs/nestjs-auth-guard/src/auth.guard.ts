import { CanActivate, ExecutionContext,
  mixin, UnauthorizedException } from '@nestjs/common';
import * as passport from 'passport';

interface AuthGuardOptions {
  session?: boolean;
  property?: string;
  callback?: (err, user, info?) => any;
}

const defaultOptions = {
  session: false,
  property: 'user',
  callback: (err, user, info) => {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  },
};

interface Type<T = any> extends Function {
    new (...args: any[]): T;
}

export function AuthGuard(
  types,
  options: AuthGuardOptions & { [key: string]: any } = defaultOptions,
): Type<CanActivate> {
  options = { ...defaultOptions, ...options };
  const guard = mixin(
    class implements CanActivate {
      async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpContext = context.switchToHttp();
        const [request, response] = [
          httpContext.getRequest(),
          httpContext.getResponse(),
        ];
        const passportFn = createPassportContext(request, response);
        const user = await passportFn(types, options);
        request[options.property || defaultOptions.property] = user;
        this.logIn(request);
        return true;
      }

      async logIn<TRequest extends { logIn: (user, callback: (error) => any) => any } = any>(
        request: TRequest,
      ): Promise<void> {
        const user = request[options.property || defaultOptions.property];
        await new Promise((resolve, reject) =>
          request.logIn(user, err => (err ? reject(err) : resolve())),
        );
      }
    },
  );
  return guard;
}

const createPassportContext = (request, response) => (types, options) =>
  new Promise((resolve, reject) =>
    passport.authenticate(types, options, (err, user, info) => {
      try {
        if (options.passReqToCallback) {
          return resolve(options.callback(request, err, user, info));
        } else {
          return resolve(options.callback(err, user, info));
        }
      } catch (err) {
        reject(err);
      }
    })(request, response, resolve),
  );
