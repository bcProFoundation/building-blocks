import {
  Module,
  NestModule,
  MiddlewareConsumer,
  Global,
  OnModuleInit,
} from '@nestjs/common';
import { PassportAuthenticateMiddleware } from '@nest-middlewares/passport';
import { EventBus, CommandBus, CQRSModule } from '@nestjs/cqrs';
import { OAuth2orizeSetup } from './middlewares/oauth2orize.setup';
import { OAuth2ConfirmationMiddleware } from './middlewares/oauth2-confirmation.middleware';
import { OAuth2AuthorizationMiddleware } from './middlewares/oauth2-authorization.middleware';
import { OAuth2TokenMiddleware } from './middlewares/oauth2-token.middleware';
import { OAuth2ErrorHandlerMiddleware } from './middlewares/oauth2-errorhandler.middleware';
import { OAuth2DecisionMiddleware } from './middlewares/oauth2-decision.middleware';
import { AuthEntitiesModule } from './entities/entities.module';
import { OAuth2Module } from './oauth2/oauth2.module';
import { PassportModule } from './passport/passport.module';
import { KeyPairGeneratorService } from './scheduler/keypair-generator.service';
import { TokenSchedulerService } from './scheduler/token-schedule.service';
import { authControllers, authServices } from './controllers';
import { RoleGuard } from './guards/role.guard';
import { TokenIntrospectionGuard } from './guards/token-introspection.guard';
import { AuthAggregates } from './aggregates';
import { AuthCommandHandlers } from './commands';
import { AuthEventHandlers } from './events';
import { ModuleRef } from '@nestjs/core';

@Global()
@Module({
  imports: [CQRSModule, AuthEntitiesModule, OAuth2Module, PassportModule],
  providers: [
    ...authServices,

    // Middlewares
    OAuth2orizeSetup,
    OAuth2ConfirmationMiddleware,
    OAuth2AuthorizationMiddleware,
    OAuth2TokenMiddleware,
    OAuth2ErrorHandlerMiddleware,

    // Scheduled Services
    KeyPairGeneratorService,
    TokenSchedulerService,

    // Guards
    RoleGuard,
    TokenIntrospectionGuard,

    // CQRS
    ...AuthAggregates,
    ...AuthCommandHandlers,
    ...AuthEventHandlers,
  ],
  controllers: [...authControllers],
  exports: [
    ...authServices,
    ...AuthAggregates,
    AuthEntitiesModule,
    KeyPairGeneratorService,
    RoleGuard,
    TokenIntrospectionGuard,
  ],
})
export class AuthModule implements NestModule, OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
  ) {}

  onModuleInit() {
    this.eventBus.setModuleRef(this.moduleRef);
    this.commandBus.setModuleRef(this.moduleRef);
    this.eventBus.register(AuthEventHandlers);
    this.commandBus.register(AuthCommandHandlers);
    // TODO: Setup Saga
  }
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
