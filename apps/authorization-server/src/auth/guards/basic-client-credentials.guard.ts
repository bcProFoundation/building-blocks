import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Client } from '../../client-management/entities/client/client.interface';
import { Request } from 'express';
import { ClientService } from '../../client-management/entities/client/client.service';
import { invalidClientException } from '../../common/filters/exceptions';
import { i18n } from '../../i18n/i18n.config';

@Injectable()
export class BasicClientCredentialsGuard implements CanActivate {
  constructor(private readonly clientService: ClientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request & {
      client: Client;
    } = context.switchToHttp().getRequest();
    let basicAuthHeader: string;
    try {
      basicAuthHeader = request.headers.authorization.split(' ')[1];
      const [clientId, clientSecret] = Buffer.from(basicAuthHeader, 'base64')
        .toString()
        .split(':');
      const client = await this.clientService.findOne({ clientId });
      if (client && client.clientSecret === clientSecret) {
        request.client = client;
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
