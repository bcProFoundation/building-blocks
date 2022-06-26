import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientAuthentication } from '../../../client-management/entities/client/client.interface';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { PassportOAuth2CodeStrategy } from '../base/oauth2-code.strategy';
import { PassportStrategy } from './passport.strategy';

@Injectable()
export class AuthorizationCodeStrategy extends PassportStrategy(
  PassportOAuth2CodeStrategy,
) {
  constructor(private readonly clientService: ClientService) {
    super({ passReqToCallback: true });
  }
  async validate(req, code, clientId, clientSecret, redirectURI, verified) {
    // check the client for allowed redirect uri and pas the code
    try {
      const client = await this.clientService.findOne({ clientId });
      if (!client) return verified(null, false);
      if (!client.redirectUris.includes(redirectURI))
        return verified(null, false);

      // Check Authentication for Client
      if (client.authenticationMethod === ClientAuthentication.BasicHeader) {
        if (req.headers.authorization) {
          const basicAuthHeader = req.headers.authorization.split(' ')[1];
          const [reqClientId, reqClientSecret] = Buffer.from(
            basicAuthHeader,
            'base64',
          )
            .toString()
            .split(':');
          if (
            reqClientId === client.clientId &&
            reqClientSecret === client.clientSecret
          ) {
            return verified(null, client);
          }
        }
      } else if (
        client.authenticationMethod === ClientAuthentication.BodyParam
      ) {
        if (
          req.body.client_id === client.clientId &&
          req.body.client_secret === client.clientSecret
        ) {
          return verified(null, client);
        }
      } else if (
        !client.authenticationMethod ||
        client.authenticationMethod === ClientAuthentication.PublicClient
      ) {
        return verified(null, client);
      }
      return verified(null, false);
    } catch (error) {
      return verified(new UnauthorizedException(error), null);
    }
  }
}
