import { ConfigService } from '../config/config.service';
import { AuthData } from './auth-data/auth-data.entity';
import { AuthorizationCode } from './authorization-code/authorization-code.entity';
import { BearerToken } from './bearer-token/bearer-token.entity';
import { Client } from './client/client.entity';
import { Role } from './role/role.entity';
import { Session } from './session/session.entity';
import { User } from './user/user.entity';
import { Scope } from './scope/scope.entity';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { ServerSettings } from './server-settings/server-settings.entity';

const config = new ConfigService();

export const TYPEORM_CONNECTION: MongoConnectionOptions = {
  type: 'mongodb',
  host: config.get('DB_HOST'),
  database: config.get('DB_NAME'),
  logging: false,
  synchronize: true,
  entities: [
    AuthData,
    AuthorizationCode,
    BearerToken,
    Client,
    Role,
    Scope,
    Session,
    User,
    ServerSettings,
  ],
};
