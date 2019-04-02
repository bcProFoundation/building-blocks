import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './client/client.component';
import { RoleComponent } from './role/role.component';
import { ScopeComponent } from './scope/scope.component';
import { UserComponent } from './user/user.component';
import { AuthSettingsComponent } from './auth-settings/auth-settings.component';
import { SocialLoginComponent } from './social-login/social-login.component';
import { ClientService } from './client/client.service';
import { UserService } from './user/user.service';
import { RoleService } from './role/role.service';
import { ScopeService } from './scope/scope.service';
import { AuthSettingsService } from './auth-settings/auth-settings.service';
import { SocialLoginService } from './social-login/social-login.service';
import { SharedImportsModule } from '../shared-imports/shared-imports.module';

@NgModule({
  declarations: [
    ClientComponent,
    RoleComponent,
    ScopeComponent,
    UserComponent,
    AuthSettingsComponent,
    SocialLoginComponent,
  ],
  imports: [SharedImportsModule, CommonModule],
  exports: [
    ClientComponent,
    RoleComponent,
    ScopeComponent,
    UserComponent,
    AuthSettingsComponent,
    SocialLoginComponent,
  ],
  providers: [
    ClientService,
    UserService,
    RoleService,
    ScopeService,
    AuthSettingsService,
    SocialLoginService,
  ],
})
export class AuthorizationUIModule {}
