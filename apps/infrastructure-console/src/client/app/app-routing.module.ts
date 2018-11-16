import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard.service';
import { ListingComponent } from './listing/listing.component';
import { ClientComponent } from './client/client.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { ScopeComponent } from './scope/scope.component';

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

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
