import { Injectable } from '@nestjs/common';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { PassportOAuth2ClientPasswordStrategy } from '../base/oauth2-client-password.strategy';
import { PassportStrategy } from './passport.strategy';

@Injectable()
export class ClientPasswordStrategy extends PassportStrategy(
  PassportOAuth2ClientPasswordStrategy,
) {
  constructor(private readonly clientService: ClientService) {
    super({ passReqToCallback: true });
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
