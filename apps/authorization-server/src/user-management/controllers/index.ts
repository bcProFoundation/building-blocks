import { RoleController } from './role/role.controller';
import { SignupController } from './signup/signup.controller';
import { UserClaimController } from './user-claim/user-claim.controller';
import { UserController } from './user/user.controller';

export const UserManagementControllers = [
  RoleController,
  SignupController,
  UserController,
  UserClaimController,
];
