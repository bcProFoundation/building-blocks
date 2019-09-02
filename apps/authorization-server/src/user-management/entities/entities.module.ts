import { Module, HttpModule } from '@nestjs/common';
import { UserService } from './user/user.service';
import { RoleService } from './role/role.service';
import { SignupService } from '../aggregates/signup/signup.service';
import { AuthDataService } from './auth-data/auth-data.service';
import { UserManagementModuleEntities } from './entities';

@Module({
  imports: [HttpModule],
  providers: [
    ...UserManagementModuleEntities,
    RoleService,
    UserService,
    AuthDataService,
    SignupService,
  ],
  exports: [
    ...UserManagementModuleEntities,
    RoleService,
    UserService,
    AuthDataService,
    SignupService,
  ],
})
export class UserManagementEntitiesModule {}
