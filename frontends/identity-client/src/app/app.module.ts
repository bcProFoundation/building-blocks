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
import { NavigationComponent } from './navigation/navigation.component';
import { MaterialModule } from './material.module';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthGuard } from './guards/auth.guard.service';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AppsComponent } from './apps/apps.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavigationService } from './navigation/navigation.service';
import { ProfileService } from './profile/profile.service';
import { MultifactorComponent } from './multifactor/multifactor.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    ProfileComponent,
    AppsComponent,
    MultifactorComponent,
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
    NavigationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
