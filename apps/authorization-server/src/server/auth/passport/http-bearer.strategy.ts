import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { BearerTokenService } from '../../models/bearer-token/bearer-token.service';
import { ConfigService } from '../../config/config.service';
import { UNAUTHORIZED } from '../../constants/messages';

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
        UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
      const localToken = await this.bearerTokenService.findOne({
        accessToken: token,
      });
      if (!localToken) done(unauthorizedError);
      const validity =
        localToken.expiresIn ||
        Number(this.configService.get('TOKEN_VALIDITY'));
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

export const callback = (err, user, info) => {
  if (typeof info !== 'undefined') {
    throw new UnauthorizedException(info.message);
  } else if (err || !user) {
    throw err || new UnauthorizedException();
  }
  return user.user;
};
