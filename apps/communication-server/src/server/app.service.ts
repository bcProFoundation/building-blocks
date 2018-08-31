import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ClientService } from './models/client/client.service';
import { PLEASE_SETUP_CLIENT } from './constants/messages';

@Injectable()
export class AppService {
  constructor(private readonly clientService: ClientService) {}

  async getClientId() {
    const client = await this.clientService.findOne({});
    if (!client)
      throw new HttpException(PLEASE_SETUP_CLIENT, HttpStatus.BAD_REQUEST);
    return {
      message: {
        clientId: client.clientId,
        authorizationServer: client.authorizationURL,
      },
    };
  }

  root() {
    return 'Hello World!';
  }
}
