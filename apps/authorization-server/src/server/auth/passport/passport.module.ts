import { Module } from '@nestjs/common';
import { CookieSerializer } from './strategies/passport-cookie.serializer';
import { LocalStrategy } from './strategies/local.strategy';
import { ClientPasswordStrategy } from './strategies/client-password.strategy';
import { AuthorizationCodeStrategy } from './strategies/authorization-code.strategy';
import { OAuth2ClientStrategy } from './strategies/oauth2-client.strategy';
import { HttpBearerStrategy } from './strategies/http-bearer.strategy';

@Module({
  providers: [
    CookieSerializer,
    LocalStrategy,
    HttpBearerStrategy,
    ClientPasswordStrategy,
    AuthorizationCodeStrategy,
    OAuth2ClientStrategy,
  ],
  exports: [
    CookieSerializer,
    LocalStrategy,
    HttpBearerStrategy,
    ClientPasswordStrategy,
    AuthorizationCodeStrategy,
    OAuth2ClientStrategy,
  ],
})
export class PassportModule {}
