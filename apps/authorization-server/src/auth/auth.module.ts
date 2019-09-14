import { Module, NestModule, MiddlewareConsumer, Global } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_FILTER } from '@nestjs/core';
import { OAuth2orizeSetup } from './middlewares/oauth2orize.setup';
import { OAuth2ConfirmationMiddleware } from './middlewares/oauth2-confirmation.middleware';
import { OAuth2AuthorizationMiddleware } from './middlewares/oauth2-authorization.middleware';
import { OAuth2TokenMiddleware } from './middlewares/oauth2-token.middleware';
import { OAuth2ErrorHandlerMiddleware } from './middlewares/oauth2-errorhandler.middleware';
import { OAuth2DecisionMiddleware } from './middlewares/oauth2-decision.middleware';
import { PassportAuthenticateMiddleware } from './middlewares/passport-authenticate.middleware';
import { CleanOauth2orizeSessionMiddleware } from './middlewares/clean-oauth2orize-session.middleware';
import { SaveDeviceInfoMiddleware } from './middlewares/save-device-info.middleware';
import { ChooseAccountMiddleware } from './middlewares/choose-account.middleware';
import { AuthEntitiesModule } from './entities/entities.module';
import { OAuth2Module } from './oauth2/oauth2.module';
import { PassportModule } from './passport/passport.module';
import { authControllers, authServices } from './controllers';
import { RoleGuard } from './guards/role.guard';
import { BasicClientCredentialsGuard } from './guards/basic-client-credentials.guard';
import { EnsureLoginGuard } from './guards/ensure-login.guard';
import { AuthAggregates } from './aggregates';
import { AuthCommandHandlers } from './commands';
import { AuthEventHandlers } from './events';
import { AuthQueryHandlers } from './queries';
import { AuthSchedulers } from './schedulers';
import { AuthorizationErrorFilter } from '../common/filters/authorization-error.filter';
import { TokenErrorFilter } from '../common/filters/token-error.filter';
import { OAuth2ErrorFilter } from '../common/filters/oauth2-error.filter';
import { OpenIDAuthorizationErrorFilter } from '../common/filters/openid-authorization-error.filter';

@Global()
@Module({
  imports: [CqrsModule, AuthEntitiesModule, OAuth2Module, PassportModule],
  providers: [
    ...authServices,

    // Middlewares
    OAuth2orizeSetup,
    OAuth2ConfirmationMiddleware,
    OAuth2AuthorizationMiddleware,
    CleanOauth2orizeSessionMiddleware,
    SaveDeviceInfoMiddleware,
    ChooseAccountMiddleware,
    OAuth2TokenMiddleware,
    OAuth2ErrorHandlerMiddleware,

    // Scheduled Services
    ...AuthSchedulers,

    // Guards
    RoleGuard,
    BasicClientCredentialsGuard,
    EnsureLoginGuard,

    // CQRS
    ...AuthAggregates,
    ...AuthCommandHandlers,
    ...AuthEventHandlers,
    ...AuthQueryHandlers,

    // oauth2orize Error Filters
    { provide: APP_FILTER, useClass: AuthorizationErrorFilter },
    { provide: APP_FILTER, useClass: TokenErrorFilter },
    { provide: APP_FILTER, useClass: OAuth2ErrorFilter },
    { provide: APP_FILTER, useClass: OpenIDAuthorizationErrorFilter },
  ],
  controllers: [...authControllers],
  exports: [
    ...authServices,
    ...AuthAggregates,
    ...AuthSchedulers,
    AuthEntitiesModule,
    RoleGuard,
    BasicClientCredentialsGuard,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        ChooseAccountMiddleware,
        OAuth2ConfirmationMiddleware,
        CleanOauth2orizeSessionMiddleware,
        SaveDeviceInfoMiddleware,
      )
      .forRoutes('/oauth2/confirmation')
      .apply(OAuth2AuthorizationMiddleware, OAuth2DecisionMiddleware)
      .forRoutes('/oauth2/authorize')
      .apply(
        PassportAuthenticateMiddleware,
        OAuth2TokenMiddleware,
        OAuth2ErrorHandlerMiddleware,
      )
      .forRoutes('/oauth2/token');
  }
}
