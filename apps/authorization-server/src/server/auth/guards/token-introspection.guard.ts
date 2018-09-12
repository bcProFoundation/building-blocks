import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientService } from '../../models/client/client.service';
import { invalidClientException } from '../filters/exceptions';
import { INVALID_PASSWORD } from '../../constants/messages';

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
      new UnauthorizedException(INVALID_PASSWORD);
    }
    return false;
  }
}
