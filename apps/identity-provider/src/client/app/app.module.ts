import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { HttpErrorHandler } from './common/http-error-handler.service';
import { MessageService } from './common/message.service';
import { ProfileNavComponent } from './profile-nav/profile-nav.component';
import { MaterialModule } from './material.module';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthGuard } from './guards/auth.guard.service';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AppsComponent } from './apps/apps.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProfileNavService } from './profile-nav/profile-nav.service';
import { ProfileService } from './profile/profile.service';
import { MultifactorComponent } from './multifactor/multifactor.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './settings/settings.service';

@NgModule({
  declarations: [
    AppComponent,
    ProfileNavComponent,
    HomeComponent,
    ProfileComponent,
    AppsComponent,
    MultifactorComponent,
    SettingsComponent,
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
    FormsModule,
  ],
  providers: [
    AppService,
    HttpErrorHandler,
    MessageService,
    AuthGuard,
    Title,
    { provide: OAuthStorage, useValue: localStorage },
    ProfileService,
    ProfileNavService,
    SettingsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
