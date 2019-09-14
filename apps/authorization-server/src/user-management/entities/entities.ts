import { Connection } from 'mongoose';
import { USER, User } from './user/user.schema';
import { ROLE, Role } from './role/role.schema';
import { AUTH_DATA, AuthData } from './auth-data/auth-data.schema';
import { MONGOOSE_CONNECTION } from '../../common/database.provider';
import {
  USER_AUTHENTICATOR,
  UserAuthenticator,
} from './user-authenticator/user-authenticator.schema';

export const UserManagementModuleEntities = [
  {
    provide: USER,
    useFactory: (connection: Connection) => connection.model(USER, User),
    inject: [MONGOOSE_CONNECTION],
  },
  {
    provide: ROLE,
    useFactory: (connection: Connection) => connection.model(ROLE, Role),
    inject: [MONGOOSE_CONNECTION],
  },
  {
    provide: AUTH_DATA,
    useFactory: (connection: Connection) =>
      connection.model(AUTH_DATA, AuthData),
    inject: [MONGOOSE_CONNECTION],
  },
  {
    provide: USER_AUTHENTICATOR,
    useFactory: (connection: Connection) =>
      connection.model(USER_AUTHENTICATOR, UserAuthenticator),
    inject: [MONGOOSE_CONNECTION],
  },
];
