import { USER, User } from './user/user.schema';
import { ROLE, Role } from './role/role.schema';
import { AUTH_DATA, AuthData } from './auth-data/auth-data.schema';

export const UserManagementModuleEntities = [
  { name: ROLE, schema: Role },
  { name: USER, schema: User },
  { name: AUTH_DATA, schema: AuthData },
];
