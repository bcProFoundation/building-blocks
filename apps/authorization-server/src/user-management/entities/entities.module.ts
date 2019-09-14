import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { RoleService } from './role/role.service';
import { SignupService } from '../aggregates/signup/signup.service';
import { AuthDataService } from './auth-data/auth-data.service';
import { UserManagementModuleEntities } from './entities';
import { UserAuthenticatorService } from './user-authenticator/user-authenticator.service';

@Module({
  providers: [
    ...UserManagementModuleEntities,
    RoleService,
    UserService,
    AuthDataService,
    SignupService,
    UserAuthenticatorService,
  ],
  exports: [
    ...UserManagementModuleEntities,
    RoleService,
    UserService,
    AuthDataService,
    SignupService,
    UserAuthenticatorService,
  ],
})
export class UserManagementEntitiesModule {}
