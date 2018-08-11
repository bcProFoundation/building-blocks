import { ConfigService } from '../config/config.service';
import { AuthData } from './auth-data/auth-data.entity';
import { AuthorizationCode } from './authorization-code/authorization-code.entity';
import { BearerToken } from './bearer-token/bearer-token.entity';
import { Client } from './client/client.entity';
import { Role } from './role/role.entity';
import { Session } from './session/session.entity';
import { User } from './user/user.entity';

const config = new ConfigService();
const typeormConnection = config.getConfig('ormconfig');
let defaultConnection;
typeormConnection.forEach(element => {
  if (element.name === 'default') {
    defaultConnection = element;
  }
});

defaultConnection.entities = [
  AuthData,
  AuthorizationCode,
  BearerToken,
  Client,
  Role,
  Session,
  User,
];

export const TYPEORM_CONNECTION = defaultConnection;
