import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from './passport.strategy';
import { Strategy } from 'passport-http-bearer';
import { ConfigService, TOKEN_VALIDITY } from '../../../config/config.service';
import { i18n } from '../../../i18n/i18n.config';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';

@Injectable()
export class HttpBearerStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly bearerTokenService: BearerTokenService,
    private readonly configService: ConfigService,
  ) {
    super();
  }
  async validate(token: any, done: (err?, user?, info?) => any) {
    try {
      const unauthorizedError = new HttpException(
        i18n.__('Unauthorized'),
        HttpStatus.UNAUTHORIZED,
      );
      const localToken = await this.bearerTokenService.findOne({
        accessToken: token,
      });
      if (!localToken) done(unauthorizedError);
      const validity =
        localToken.expiresIn || Number(this.configService.get(TOKEN_VALIDITY));
      const expires = new Date(
        new Date(localToken.creation).getTime() + validity * 1000,
      );
      const now = new Date();
      if (now > expires) {
        done(unauthorizedError);
      } else done(null, { user: localToken.user });
    } catch (error) {
      done(error);
    }
  }
}
