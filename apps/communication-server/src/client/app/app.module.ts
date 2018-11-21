import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { HttpErrorHandler } from './http-error-handler.service';
import { MessageService } from './message.service';
import { MaterialModule } from './material.module';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthGuard } from './guards/auth.guard.service';
import { HomeComponent } from './home/home.component';
import { AppsComponent } from './apps/apps.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavigationComponent } from './navigation/navigation.component';
import { ListingComponent } from './listing/listing.component';
import { ListingService } from './common/listing.service';
import { EmailComponent } from './email/email.component';
import { EmailService } from './email/email.service';
import { SettingsComponent } from './settings/settings.component';
import { WebhookComponent } from './webhook/webhook.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AppsComponent,
    NavigationComponent,
    ListingComponent,
    EmailComponent,
    SettingsComponent,
    WebhookComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    OAuthModule.forRoot(),
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [
    AppService,
    HttpErrorHandler,
    MessageService,
    AuthGuard,
    Title,
    ListingService,
    EmailService,
    { provide: OAuthStorage, useValue: localStorage },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
