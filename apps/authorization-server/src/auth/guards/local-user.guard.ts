import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  addSessionUser,
  createPassportContext,
  defaultOptions,
  RequestUser,
} from './guard.utils';
import { callback } from '../passport/strategies/local.strategy';

@Injectable()
export class LocalUserGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const [request, response] = [
      httpContext.getRequest(),
      httpContext.getResponse(),
    ];

    const passportFn = createPassportContext(request, response);
    const user = await passportFn('local', { session: true, callback });
    request[defaultOptions.property] = user;

    const reqUser = user as RequestUser;
    addSessionUser(request, {
      uuid: reqUser.uuid,
      email: reqUser.email,
      phone: reqUser.phone,
    });
    await this.logIn(request);
    return true;
  }

  public async logIn<
    TRequest extends {
      logIn: (user, callback: (error) => any) => any;
    } = any
  >(request: TRequest): Promise<void> {
    const user = request[defaultOptions.property];
    await new Promise<void>((resolve, reject) =>
      request.logIn(user, err => (err ? reject(err) : resolve())),
    );
  }
}
