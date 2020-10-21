import { Module } from '@nestjs/common';
import { AuthorizationCodeService } from './authorization-code/authorization-code.service';
import { BearerTokenService } from './bearer-token/bearer-token.service';
import { OIDCKeyService } from './oidc-key/oidc-key.service';
import { SocialLoginService } from './social-login/social-login.service';
import { SessionService } from './session/session.service';
import { AuthModuleEntities } from './entities';
import { UserClaimService } from './user-claim/user-claim.service';

@Module({
  providers: [
    ...AuthModuleEntities,
    AuthorizationCodeService,
    BearerTokenService,
    OIDCKeyService,
    SocialLoginService,
    SessionService,
    UserClaimService,
  ],
  exports: [
    ...AuthModuleEntities,
    AuthorizationCodeService,
    BearerTokenService,
    OIDCKeyService,
    SocialLoginService,
    SessionService,
    UserClaimService,
  ],
})
export class AuthEntitiesModule {}
