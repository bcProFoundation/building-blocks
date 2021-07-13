import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { TokenCache } from '../../../auth/entities/token-cache/token-cache.entity';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

export const GET_CLIENT_ENDPOINT = '/client/v1/get_by_client_id';
export const AUTHORIZATION_SERVER_CONNECTION_ERROR =
  'AUTHORIZATION_SERVER_CONNECTION_ERROR';

@Injectable()
export class ClientIdMustExistOnAuthorizationServerPolicyService {
  constructor(
    private readonly settings: ServerSettingsService,
    private readonly http: HttpService,
  ) {}

  async validate(clientId: string, token: TokenCache) {
    const settings = await this.settings.find();
    const requestUrl =
      settings.authServerURL + GET_CLIENT_ENDPOINT + '/' + clientId;
    try {
      const response = await lastValueFrom(
        this.http.get(requestUrl, {
          headers: { Authorization: 'Bearer ' + token.accessToken },
        }),
      );
      if (response.data.clientId !== clientId) {
        throw new NotFoundException({ clientId });
      }
    } catch (error) {
      throw new BadRequestException(
        error.message,
        AUTHORIZATION_SERVER_CONNECTION_ERROR,
      );
    }
  }
}
