import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { VerifySignupComponent } from './verify-signup/verify-signup.component';

const routes: Routes = [
  { path: '', redirectTo: 'account', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/:code', component: VerifySignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService],
})
export class AppRoutingModule {}
