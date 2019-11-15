import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AUTHORIZATION } from '../../constants/app-strings';
import { ServerSettingsService } from '../../system-settings/entities/server-settings/server-settings.service';

@Injectable()
export class AuthServerVerificationGuard implements CanActivate {
  constructor(private readonly settingsService: ServerSettingsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    if (
      request.headers[AUTHORIZATION] &&
      (await this.verifyAuthorization(request.headers[AUTHORIZATION]))
    ) {
      return true;
    }
    return false;
  }

  async verifyAuthorization(authorizationHeader): Promise<boolean> {
    try {
      const basicAuthHeader = authorizationHeader.split(' ')[1];
      const [clientId, clientSecret] = Buffer.from(basicAuthHeader, 'base64')
        .toString()
        .split(':');
      const settings = await this.settingsService.find();
      if (
        settings &&
        settings.clientId &&
        settings.clientId === clientId &&
        settings.clientSecret === clientSecret
      ) {
        return true;
      }
    } catch (error) {
      new ForbiddenException();
    }
    return false;
  }
}
