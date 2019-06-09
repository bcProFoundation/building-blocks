import { Module, Global, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth2ProviderController } from './controllers/oauth2-provider/oauth2-provider.controller';
import { OAuth2Provider } from './entities/oauth2-provider/oauth2-provider.entity';
import { OAuth2ClientEntityProviders } from './entities';
import { OAuth2ClientAggregates } from './aggregates';
import { OAuth2ClientCommandHandlers } from './commands';
import { OAuth2ClientQueryHandlers } from './queries';
import { OAuth2ClientEventHandlers } from './events';
import { OAuth2Token } from './entities/oauth2-token/oauth2-token.entity';
import { CqrsModule } from '@nestjs/cqrs';

Global();
@Module({
  imports: [
    TypeOrmModule.forFeature([OAuth2Provider, OAuth2Token]),
    CqrsModule,
    HttpModule,
  ],
  providers: [
    ...OAuth2ClientEntityProviders,
    ...OAuth2ClientAggregates,
    ...OAuth2ClientCommandHandlers,
    ...OAuth2ClientQueryHandlers,
    ...OAuth2ClientEventHandlers,
  ],
  controllers: [Oauth2ProviderController],
})
export class Oauth2ClientModule {}
