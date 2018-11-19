import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard.service';
import { HomeComponent } from './home/home.component';
import { AppsComponent } from './apps/apps.component';
import { ListingComponent } from './listing/listing.component';
import { EmailComponent } from './email/email.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'apps', component: AppsComponent, canActivate: [AuthGuard] },

  { path: 'email/list', component: ListingComponent, canActivate: [AuthGuard] },
  {
    path: 'email/:uuid',
    component: EmailComponent,
    canActivateChild: [AuthGuard],
  },

  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
