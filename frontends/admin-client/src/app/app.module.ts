import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { HttpErrorHandler } from './common/services/http-error-handler/http-error-handler.service';
import { MessageService } from './common/services/message/message.service';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { AccessTokenInjector } from './common/interceptors/access-token-injector/access-token-injector.interceptor';
import { SharedUIModule } from './shared-ui/shared-ui.module';
import { AuthorizationUIModule } from './authorization-ui/authorization-ui.module';
import { CommunicationUIModule } from './communication-ui/communication-ui.module';
import { InfrastructureUIModule } from './infrastructure-ui/infrastructure-ui.module';
import { IdentityProviderUIModule } from './identity-provider-ui/identity-provider-ui.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    OAuthModule.forRoot(),
    SharedUIModule,
    CommunicationUIModule,
    AuthorizationUIModule,
    InfrastructureUIModule,
    IdentityProviderUIModule,
  ],
  providers: [
    AppService,
    HttpErrorHandler,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AccessTokenInjector,
      multi: true,
    },
    {
      provide: OAuthStorage,
      useValue: localStorage,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
