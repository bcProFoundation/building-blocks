import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthServerMaterialModule } from './auth-server-material/auth-server-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AccountComponent } from './account/account.component';
import { AuthService } from './auth/auth.service';
import { AVAILABLE_TRANSLATIONS } from '../constants/app-strings';
import { VerifyGeneratePasswordComponent } from './verify-generate-password/verify-generate-password.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChooseAccountComponent } from './choose-account/choose-account.component';
import { PasswordRequirementComponent } from './password-requirement/password-requirement.component';

let lang = navigator.language;
if (!AVAILABLE_TRANSLATIONS.includes(lang)) {
  lang = 'en-US';
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    AccountComponent,
    VerifyGeneratePasswordComponent,
    ChooseAccountComponent,
    PasswordRequirementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AuthServerMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [AuthService, { provide: LOCALE_ID, useValue: lang }],
  bootstrap: [AppComponent],
})
export class AppModule {}
