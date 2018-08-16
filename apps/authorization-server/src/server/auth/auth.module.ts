import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
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
import { RolesGuard } from './guards/roles.guard';
import { RoleController } from './controllers/role/role.controller';
import { ClientController } from './controllers/client/client.controller';
import { ConfigModule } from '../config/config.module';
import { OAuth2DecisionMiddleware } from './middlewares/oauth2-decision.middleware';
import { SetupController } from './controllers/setup/setup.controller';
import { SetupService } from './controllers/setup/setup.service';
import { OAuth2TokenGeneratorService } from './middlewares/oauth2-token-generator.service';

@Module({
  providers: [
    AuthService,
    SetupService,
    OAuth2TokenGeneratorService,

    // Passport Strategies
    CookieSerializer,
    LocalStrategy,
    HttpBearerStrategy,
    ClientPasswordStrategy,
    AuthorizationCodeStrategy,

    // Middlewares
    OAuth2orizeSetup,
    OAuth2ConfirmationMiddleware,
    OAuth2AuthorizationMiddleware,
    OAuth2TokenMiddleware,
    OAuth2ErrorHandlerMiddleware,

    // Guards
    RolesGuard,
  ],
  controllers: [
    AuthController,
    OAuth2Controller,
    UserController,
    RoleController,
    ClientController,
    SetupController,
  ],
  imports: [ModelsModule, UtilitiesModule, ConfigModule],
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
