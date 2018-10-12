import { Injectable } from '@nestjs/common';
import { PassportStrategy } from './passport.strategy';
import { ClientService } from '../../models/client/client.service';
import { Strategy } from 'passport-oauth2-code';

@Injectable()
export class AuthorizationCodeStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly clientService: ClientService) {
    super();
  }
  async validate(code, clientId, clientSecret, redirectURI, verified) {
    // check the client for allowed redirect uri and pas the code
    try {
      const client = await this.clientService.findOne({ clientId });
      if (!client) return verified(null, false);
      if (!client.redirectUris.includes(redirectURI))
        return verified(null, false);
      return verified(null, client);
    } catch (error) {
      return verified(error, null);
    }
  }
}
