import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { i18n } from '../../../i18n/i18n.config';

@Injectable()
export class OAuth2Service {
  constructor(private readonly bearerTokenService: BearerTokenService) {}

  async tokenRevoke(token) {
    const bearerToken = await this.bearerTokenService.findOne({
      accessToken: token,
    });
    if (bearerToken) {
      bearerToken.remove();
    } else {
      throw new HttpException(
        i18n.__('Invalid Bearer Token'),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async tokenIntrospection(token) {
    const bearerToken = await this.bearerTokenService.findOne({
      accessToken: token,
    });

    if (!bearerToken) {
      throw new HttpException(
        i18n.__('Bearer Token not found'),
        HttpStatus.NOT_FOUND,
      );
    }

    const exp = new Date(
      bearerToken.creation.getTime() + bearerToken.expiresIn * 1000,
    );

    const tokenData: any = {
      // client_id: bearerToken.client.clientId,
      active: exp.valueOf() > new Date().valueOf(),
      exp: exp.valueOf(),
    };

    if (bearerToken.user) tokenData.sub = bearerToken.user;
    if (bearerToken.scope) tokenData.scope = bearerToken.scope;

    return tokenData;
  }
}
