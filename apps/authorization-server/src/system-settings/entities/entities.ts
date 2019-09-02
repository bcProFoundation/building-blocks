import { Connection } from 'mongoose';
import {
  SERVER_SETTINGS,
  ServerSettings,
} from './server-settings/server-settings.schema';
import { MONGOOSE_CONNECTION } from '../../common/database.provider';

export const SystemSettingsModuleEntities = [
  {
    provide: SERVER_SETTINGS,
    useFactory: (connection: Connection) =>
      connection.model(SERVER_SETTINGS, ServerSettings),
    inject: [MONGOOSE_CONNECTION],
  },
];
