import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createPassportContext, defaultOptions } from './guard.utils';
import { callback } from '../passport/strategies/local.strategy';
import { BearerTokenService } from '../entities/bearer-token/bearer-token.service';

export const TOKEN = 'token';
@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(private readonly token: BearerTokenService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const [request, response] = [
      httpContext.getRequest(),
      httpContext.getResponse(),
    ];
    const passportFn = createPassportContext(request, response);
    const user = await passportFn('bearer', { session: false, callback });
    request[defaultOptions.property] = user;

    const accessToken = this.getAccessToken(request);
    const token = await this.token.findOne({ accessToken });
    if (token) {
      request[TOKEN] = token;
    }
    return true;
  }

  getAccessToken(request) {
    if (!request.headers.authorization) {
      if (!request.query.access_token) return null;
    }
    return (
      request.query.access_token ||
      request.headers.authorization.split(' ')[1] ||
      null
    );
  }
}
