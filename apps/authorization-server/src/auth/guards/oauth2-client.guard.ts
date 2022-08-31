import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  addSessionUser,
  createPassportContext,
  defaultOptions,
  RequestUser,
} from './guard.utils';
import { callback } from '../passport/strategies/oauth2-client.strategy';

@Injectable()
export class OAuth2ClientGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const [request, response] = [
      httpContext.getRequest(),
      httpContext.getResponse(),
    ];

    const passportFn = createPassportContext(request, response);
    const user = await passportFn('oauth2-client', { session: true, callback });
    request[defaultOptions.property] = user;

    const reqUser = user as RequestUser;
    const users = request.session?.users;
    await this.logIn(request);
    request.session.users = users;
    addSessionUser(request, {
      uuid: reqUser.uuid,
      email: reqUser.email,
      phone: reqUser.phone,
    });

    return true;
  }

  public async logIn<
    TRequest extends {
      logIn: (user, callback: (error) => any) => any;
    } = any,
  >(request: TRequest): Promise<void> {
    const user = request[defaultOptions.property];
    await new Promise<void>((resolve, reject) =>
      request.logIn(user, err => (err ? reject(err) : resolve())),
    );
  }
}
