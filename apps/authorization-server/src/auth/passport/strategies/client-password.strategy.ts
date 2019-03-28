import { Injectable } from '@nestjs/common';
import { PassportStrategy } from './passport.strategy';
import { Strategy } from 'passport-oauth2-client-password';
import { ClientService } from '../../../client-management/entities/client/client.service';

@Injectable()
export class ClientPasswordStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly clientService: ClientService) {
    super();
  }

  async validate(clientId, clientSecret, done: (err, user) => any) {
    try {
      const client = await this.clientService.findOne({ clientId });
      if (!client) return done(null, false);
      if (client.clientSecret !== clientSecret) return done(null, false);
      return done(null, client);
    } catch (error) {
      return done(error, null);
    }
  }
}
