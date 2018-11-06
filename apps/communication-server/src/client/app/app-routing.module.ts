import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard.service';
import { HomeComponent } from './home/home.component';
import { AppsComponent } from './apps/apps.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  // { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'apps', component: AppsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
