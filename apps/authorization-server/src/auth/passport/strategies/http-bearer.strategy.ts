import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { ConfigService, TOKEN_VALIDITY } from '../../../config/config.service';
import { i18n } from '../../../i18n/i18n.config';
import { PassportHttpBearerStrategy } from '../base/http-bearer.strategy';
import { PassportStrategy } from './passport.strategy';

@Injectable()
export class HttpBearerStrategy extends PassportStrategy(
  PassportHttpBearerStrategy,
) {
  constructor(
    private readonly bearerTokenService: BearerTokenService,
    private readonly configService: ConfigService,
  ) {
    super({ passReqToCallback: true });
  }
  async validate(
    req: Request,
    token: string,
    done: (err?, user?, info?) => any,
  ) {
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
      } else return done(null, { user: localToken.user });
    } catch (error) {
      return done(error);
    }
  }
}
