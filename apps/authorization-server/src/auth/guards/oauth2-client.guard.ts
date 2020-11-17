import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createPassportContext, defaultOptions } from './guard.utils';
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
    return true;
  }
}
