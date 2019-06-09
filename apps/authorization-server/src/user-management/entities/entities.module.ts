import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user/user.service';
import { RoleService } from './role/role.service';
import { SignupService } from '../aggregates/signup/signup.service';
import { AuthDataService } from './auth-data/auth-data.service';
import { UserManagementModuleEntities } from './entities';

@Module({
  imports: [
    MongooseModule.forFeature(UserManagementModuleEntities),
    HttpModule,
  ],
  providers: [RoleService, UserService, AuthDataService, SignupService],
  exports: [
    RoleService,
    UserService,
    AuthDataService,
    SignupService,
    MongooseModule.forFeature(UserManagementModuleEntities),
  ],
})
export class UserManagementEntitiesModule {}
