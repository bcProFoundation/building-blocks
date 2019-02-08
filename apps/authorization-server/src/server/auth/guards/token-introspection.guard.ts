import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientService } from '../../client-management/entities/client/client.service';
import { invalidClientException } from '../../common/filters/exceptions';
import { i18n } from '../../i18n/i18n.config';

@Injectable()
export class TokenIntrospectionGuard implements CanActivate {
  constructor(private readonly clientService: ClientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let basicAuthHeader: string;
    try {
      basicAuthHeader = request.headers.authorization.split(' ')[1];
      const [clientId, clientSecret] = Buffer.from(basicAuthHeader, 'base64')
        .toString()
        .split(':');
      const client = await this.clientService.findOne({ clientId });
      if (client && client.clientSecret === clientSecret) {
        return true;
      } else {
        throw invalidClientException;
      }
    } catch (error) {
      new UnauthorizedException(i18n.__('Invalid Password'));
    }
    return false;
  }
}
