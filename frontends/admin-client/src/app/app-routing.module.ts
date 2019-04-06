import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './shared-ui/home/home.component';
import { AuthGuard } from './common/guards/auth-guard/auth.guard.service';
import { ListingComponent } from './shared-ui/listing/listing.component';
import { ClientComponent } from './authorization-ui/client/client.component';
import { DashboardComponent } from './shared-ui/dashboard/dashboard.component';
import { UserComponent } from './authorization-ui/user/user.component';
import { RoleComponent } from './authorization-ui/role/role.component';
import { ScopeComponent } from './authorization-ui/scope/scope.component';
import { AuthSettingsComponent } from './authorization-ui/auth-settings/auth-settings.component';
import { SocialLoginComponent } from './authorization-ui/social-login/social-login.component';
import { EmailComponent } from './communication-ui/email/email.component';
import { CloudStorageComponent } from './communication-ui/cloud-storage/cloud-storage.component';
import { ServiceComponent } from './infrastructure-ui/service/service.component';
import { ServiceTypeComponent } from './infrastructure-ui/service-type/service-type.component';
import { CommunicationSettingsComponent } from './communication-ui/communication-settings/communication-settings.component';
import { InfrastructureSettingsComponent } from './infrastructure-ui/infrastructure-settings/infrastructure-settings.component';
import { IdpSettingsComponent } from './identity-provider-ui/idp-settings/idp-settings.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'client/list',
    component: ListingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'role/list',
    component: ListingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/list',
    component: ListingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'scope/list',
    component: ListingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'social_login/list',
    component: ListingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'email/list',
    component: ListingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'storage/list',
    component: ListingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'service/list',
    component: ListingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'service_type/list',
    component: ListingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'client/:id',
    component: ClientComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'user/:id',
    component: UserComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'role/:id',
    component: RoleComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'scope/:id',
    component: ScopeComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'social_login/:id',
    component: SocialLoginComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'email/:id',
    component: EmailComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'storage/:id',
    component: CloudStorageComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'service/:id',
    component: ServiceComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'service_type/:id',
    component: ServiceTypeComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'auth_settings',
    component: AuthSettingsComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'communication_settings',
    component: CommunicationSettingsComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'infrastructure_settings',
    component: InfrastructureSettingsComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'idp_settings',
    component: IdpSettingsComponent,
    canActivateChild: [AuthGuard],
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
