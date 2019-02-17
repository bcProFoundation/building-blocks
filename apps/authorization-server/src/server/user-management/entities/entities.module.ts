import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER, User } from './user/user.schema';
import { UserService } from './user/user.service';
import { ROLE, Role } from './role/role.schema';
import { AUTH_DATA, AuthData } from './auth-data/auth-data.schema';
import { RoleService } from './role/role.service';
import { SignupService } from '../aggregates/signup/signup.service';
import { AuthDataService } from './auth-data/auth-data.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ROLE, schema: Role },
      { name: USER, schema: User },
      { name: AUTH_DATA, schema: AuthData },
    ]),
    HttpModule,
  ],
  providers: [RoleService, UserService, AuthDataService, SignupService],
  exports: [RoleService, UserService, AuthDataService, SignupService],
})
export class UserManagementEntitiesModule {}
