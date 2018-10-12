import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthServerVerificationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    // TODO: verify raw data with client secret and following header
    if (!request.headers['X-AUTHSERVER-SIGN'.toLowerCase()]) {
      return false;
    }
    return true;
  }
}
