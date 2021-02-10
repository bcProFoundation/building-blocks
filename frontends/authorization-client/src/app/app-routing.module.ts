import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { VerifyGeneratePasswordComponent } from './verify-generate-password/verify-generate-password.component';
import { ChooseAccountComponent } from './choose-account/choose-account.component';
import { AuthenticationKeysComponent } from './authentication-keys/authentication-keys.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const routes: Routes = [
  { path: '', redirectTo: 'account', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'account/choose', component: ChooseAccountComponent },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'account/keys/:userUuid',
    component: AuthenticationKeysComponent,
  },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/:code', component: VerifyGeneratePasswordComponent },
  { path: 'forgot/:code', component: VerifyGeneratePasswordComponent },
  { path: 'verify', component: VerifyEmailComponent },
  { path: 'verify/:code', component: VerifyEmailComponent },

  { path: '**', redirectTo: 'account', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService],
})
export class AppRoutingModule {}
