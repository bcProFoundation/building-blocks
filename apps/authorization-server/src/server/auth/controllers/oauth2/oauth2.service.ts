import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { INVALID_TOKEN, TOKEN_NOT_FOUND } from '../../../constants/messages';

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
      throw new HttpException(INVALID_TOKEN, HttpStatus.NOT_FOUND);
    }
  }

  async tokenIntrospection(token) {
    const bearerToken = await this.bearerTokenService.findOne({
      accessToken: token,
    });

    if (!bearerToken) {
      throw new HttpException(TOKEN_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const exp = new Date(
      bearerToken.creation.getTime() + bearerToken.expiresIn * 1000,
    );

    const tokenData: any = {
      // client_id: bearerToken.client.clientId,
      active: exp.valueOf() > new Date().valueOf(),
      exp: exp.valueOf(),
    };

    // if (bearerToken.user && bearerToken.user.uuid)
    //   tokenData.username = bearerToken.user.email;
    if (bearerToken.scope) tokenData.scope = bearerToken.scope;

    return tokenData;
  }
}
