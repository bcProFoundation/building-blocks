import { Client, CLIENT } from './client/client.schema';
import { SCOPE, Scope } from './scope/scope.schema';
import { MONGOOSE_CONNECTION } from '../../common/database.provider';
import { Connection } from 'mongoose';

export const ClientManagementModuleEntities = [
  {
    provide: CLIENT,
    useFactory: (connection: Connection) => connection.model(CLIENT, Client),
    inject: [MONGOOSE_CONNECTION],
  },
  {
    provide: SCOPE,
    useFactory: (connection: Connection) => connection.model(SCOPE, Scope),
    inject: [MONGOOSE_CONNECTION],
  },
];
