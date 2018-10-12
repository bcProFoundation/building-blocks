import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SETUP_ALREADY_COMPLETE } from '../../constants/messages';
import { ClientService } from '../../models/client/client.service';
import { Client } from '../../models/client/client.entity';
import { SetupFormDTO } from './setup-form-dto';

@Injectable()
export class SetupService {
  constructor(private readonly clientService: ClientService) {}

  async setupCommunicationClient(setupForm: SetupFormDTO) {
    const existingClients = await this.clientService.find();

    if (existingClients.length > 0) {
      throw new HttpException(SETUP_ALREADY_COMPLETE, HttpStatus.UNAUTHORIZED);
    }

    return await this.createClient(setupForm);
  }

  async createClient(setupForm: SetupFormDTO) {
    const client = new Client();
    client.clientId = setupForm.clientId;
    client.clientSecret = setupForm.clientSecret;
    client.authorizationURL =
      setupForm.authorizationServer + '/oauth2/confirmation';
    client.tokenURL = setupForm.authorizationServer + '/oauth2/token';
    client.callbackURL = setupForm.clientUrl + '/auth/callback';
    client.introspectionURL =
      setupForm.authorizationServer + '/oauth2/introspection';
    client.profileURL = setupForm.authorizationServer + '/oauth2/introspection';
    return await this.clientService.save(client);
  }
}
