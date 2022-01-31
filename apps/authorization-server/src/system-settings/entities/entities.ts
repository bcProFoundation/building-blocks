import { Connection } from 'mongoose';
import {
  SERVER_SETTINGS,
  ServerSettings,
  SERVER_SETTINGS_COLLECTION_NAME,
} from './server-settings/server-settings.schema';
import { MONGOOSE_CONNECTION } from '../../common/database.provider';

export const SystemSettingsModuleEntities = [
  {
    provide: SERVER_SETTINGS,
    useFactory: (connection: Connection) =>
      connection.model(
        SERVER_SETTINGS,
        ServerSettings,
        SERVER_SETTINGS_COLLECTION_NAME,
        { overwriteModels: process.env.NODE_ENV === 'test-e2e' },
      ),
    inject: [MONGOOSE_CONNECTION],
  },
];
