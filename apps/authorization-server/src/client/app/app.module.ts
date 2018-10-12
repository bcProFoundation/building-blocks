import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HttpClientModule,
  HttpClientXsrfModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthServerMaterialModule } from './auth-server-material/auth-server-material.module';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AccountComponent } from './account/account.component';
import { AuthService } from './auth/auth.service';
import { ServerSettingsComponent } from './server-settings/server-settings.component';
import { ServerSettingsService } from './server-settings/server-settings.service';
import { XsrfInterceptor } from './interceptors/xsrf.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    AccountComponent,
    ServerSettingsComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'authorization-server' }),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AuthServerMaterialModule,
    FormsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: '_csrf',
      headerName: 'xsrf-token',
    }),
  ],
  providers: [
    AuthService,
    ServerSettingsService,
    { provide: HTTP_INTERCEPTORS, useClass: XsrfInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
