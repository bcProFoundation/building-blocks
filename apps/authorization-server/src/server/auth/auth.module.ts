import {
  Module,
  NestModule,
  MiddlewareConsumer,
  HttpModule,
} from '@nestjs/common';
import { PassportAuthenticateMiddleware } from '@nest-middlewares/passport';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './controllers/auth/auth.service';
import { CookieSerializer } from './passport/passport-cookie.serializer';
import { LocalStrategy } from './passport/local.strategy';
import { ModelsModule } from '../models/models.module';
import { UtilitiesModule } from '../utilities/utilities.module';
import { HttpBearerStrategy } from './passport/http-bearer.strategy';
import { ClientPasswordStrategy } from './passport/client-password.strategy';
import { OAuth2Controller } from './controllers/oauth2/oauth2.controller';
import { AuthorizationCodeStrategy } from './passport/authorization-code.strategy';
import { OAuth2orizeSetup } from './middlewares/oauth2orize.setup';
import { OAuth2ConfirmationMiddleware } from './middlewares/oauth2-confirmation.middleware';
import { OAuth2AuthorizationMiddleware } from './middlewares/oauth2-authorization.middleware';
import { OAuth2TokenMiddleware } from './middlewares/oauth2-token.middleware';
import { OAuth2ErrorHandlerMiddleware } from './middlewares/oauth2-errorhandler.middleware';
import { UserController } from './controllers/user/user.controller';
import { RoleGuard } from './guards/role.guard';
import { RoleController } from './controllers/role/role.controller';
import { ClientController } from './controllers/client/client.controller';
import { ConfigModule } from '../config/config.module';
import { OAuth2DecisionMiddleware } from './middlewares/oauth2-decision.middleware';
import { SetupController } from './controllers/setup/setup.controller';
import { SetupService } from './controllers/setup/setup.service';
import { OAuth2TokenGeneratorService } from './middlewares/oauth2-token-generator.service';
import { OAuth2Service } from './controllers/oauth2/oauth2.service';
import { CodeGrantService } from './oauth2-services/code-grant/code-grant.service';
import { TokenGrantService } from './oauth2-services/token-grant/token-grant.service';
import { CodeExchangeService } from './oauth2-services/code-exchange/code-exchange.service';
import { PasswordExchangeService } from './oauth2-services/password-exchange/password-exchange.service';
import { ClientCredentialExchangeService } from './oauth2-services/client-credential-exchange/client-credential-exchange.service';
import { RefreshTokenExchangeService } from './oauth2-services/refresh-token-exchange/refresh-token-exchange.service';
import { IDTokenGrantService } from './oauth2-services/id-token-grant/id-token-grant.service';
import { ServerSettingsController } from './controllers/server-settings/server-settings.controller';
import { WellKnownController } from './controllers/well-known/well-known.controller';
import { OIDCKeyService } from '../models/oidc-key/oidc-key.service';
import { TokenIntrospectionGuard } from './guards/token-introspection.guard';
import { ScopeController } from './controllers/scope/scope.controller';
import { SignupController } from './controllers/signup/signup.controller';
import { SignupService } from './controllers/signup/signup.service';
import { CRUDOperationService } from './controllers/common/crudoperation/crudoperation.service';
import { OAuth2ClientStrategy } from './passport/oauth2-client.strategy';
import { SocialLoginController } from './controllers/social-login/social-login.controller';
import { SocialLoginManagementService } from './controllers/social-login/social-login-management.service';
import { WellKnownService } from '../auth/controllers/well-known/well-known.service';

@Module({
  providers: [
    AuthService,
    SetupService,
    OAuth2Service,
    OAuth2TokenGeneratorService,
    CodeGrantService,
    TokenGrantService,
    CodeExchangeService,
    PasswordExchangeService,
    ClientCredentialExchangeService,
    RefreshTokenExchangeService,
    IDTokenGrantService,
    OIDCKeyService,
    SignupService,
    SocialLoginManagementService,
    WellKnownService,

    // Passport Strategies
    CookieSerializer,
    LocalStrategy,
    HttpBearerStrategy,
    ClientPasswordStrategy,
    AuthorizationCodeStrategy,
    OAuth2ClientStrategy,

    // Middlewares
    OAuth2orizeSetup,
    OAuth2ConfirmationMiddleware,
    OAuth2AuthorizationMiddleware,
    OAuth2TokenMiddleware,
    OAuth2ErrorHandlerMiddleware,

    // Guards
    RoleGuard,
    TokenIntrospectionGuard,
    CRUDOperationService,
  ],
  controllers: [
    AuthController,
    OAuth2Controller,
    UserController,
    RoleController,
    ClientController,
    SetupController,
    ServerSettingsController,
    WellKnownController,
    ScopeController,
    SignupController,
    SocialLoginController,
  ],
  imports: [ModelsModule, UtilitiesModule, ConfigModule, HttpModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OAuth2ConfirmationMiddleware)
      .forRoutes('/oauth2/confirmation')
      .apply(OAuth2AuthorizationMiddleware, OAuth2DecisionMiddleware)
      .forRoutes('/oauth2/authorize')
      .apply(
        PassportAuthenticateMiddleware,
        OAuth2TokenMiddleware,
        OAuth2ErrorHandlerMiddleware,
      )
      .with(['oauth2-code', 'oauth2-client-password'], { session: false })
      .forRoutes('/oauth2/token');
  }
}
