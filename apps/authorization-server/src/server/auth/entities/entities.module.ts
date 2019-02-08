import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorizationCodeService } from './authorization-code/authorization-code.service';
import {
  AuthorizationCode,
  AUTHORIZATION_CODE,
} from './authorization-code/authorization-code.schema';
import { BearerToken, BEARER_TOKEN } from './bearer-token/bearer-token.schema';
import { BearerTokenService } from './bearer-token/bearer-token.service';
import { OIDCKey, OIDC_KEY } from './oidc-key/oidc-key.schema';
import { OIDCKeyService } from './oidc-key/oidc-key.service';
import { SocialLogin, SOCIAL_LOGIN } from './social-login/social-login.schema';
import { SocialLoginService } from './social-login/social-login.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AUTHORIZATION_CODE, schema: AuthorizationCode },
      { name: BEARER_TOKEN, schema: BearerToken },
      { name: OIDC_KEY, schema: OIDCKey },
      { name: SOCIAL_LOGIN, schema: SocialLogin },
    ]),
    HttpModule,
  ],
  providers: [
    AuthorizationCodeService,
    BearerTokenService,
    OIDCKeyService,
    SocialLoginService,
  ],
  exports: [
    AuthorizationCodeService,
    BearerTokenService,
    OIDCKeyService,
    SocialLoginService,
  ],
})
export class AuthEntitiesModule {}
