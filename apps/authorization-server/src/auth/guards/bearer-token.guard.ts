import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createPassportContext, defaultOptions } from './guard.utils';
import { callback } from '../passport/strategies/local.strategy';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const [request, response] = [
      httpContext.getRequest(),
      httpContext.getResponse(),
    ];

    const passportFn = createPassportContext(request, response);
    const user = await passportFn('bearer', { session: false, callback });
    request[defaultOptions.property] = user;
    return true;
  }
}
