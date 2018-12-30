import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { HttpErrorHandler } from './common/http-error-handler.service';
import { MessageService } from './common/message.service';
import { MaterialModule } from './material.module';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { ListingComponent } from './listing/listing.component';
import { ClientComponent } from './client/client.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccessTokenInjector } from './interceptors/access-token-injector/access-token-injector.interceptor';
import { ClientService } from './client/client.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoleComponent } from './role/role.component';
import { ScopeComponent } from './scope/scope.component';
import { UserComponent } from './user/user.component';
import { UserService } from './user/user.service';
import { RoleService } from './role/role.service';
import { ScopeService } from './scope/scope.service';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './settings/settings.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    NavigationComponent,
    ListingComponent,
    ClientComponent,
    RoleComponent,
    ScopeComponent,
    UserComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    OAuthModule.forRoot(),
    MaterialModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    FlexLayoutModule,
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
    ClientService,
    UserService,
    RoleService,
    ScopeService,
    SettingsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
