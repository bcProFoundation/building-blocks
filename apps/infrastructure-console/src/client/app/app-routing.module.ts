import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard.service';
import { ClientsComponent } from './clients/clients.component';
import { ClientComponent } from './client/client.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'client/list',
    component: ClientsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'client/:id',
    component: ClientComponent,
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
