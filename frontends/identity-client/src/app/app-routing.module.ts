import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard.service';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AppsComponent } from './apps/apps.component';
import { MultifactorComponent } from './multifactor/multifactor.component';
import { UpdatePhoneComponent } from './update-phone/update-phone.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'mfa', component: MultifactorComponent, canActivate: [AuthGuard] },
  { path: 'apps', component: AppsComponent, canActivate: [AuthGuard] },
  {
    path: 'update_phone',
    component: UpdatePhoneComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
