import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import {
  DB_PASSWORD,
  DB_USER,
  DB_HOST,
  DB_NAME,
  MONGO_URI_PREFIX,
  ConfigService,
} from '../config/config.service';
import { ServerSettings } from '../system-settings/entities/server-settings/server-settings.entity';
import { Profile } from '../profile-management/entities/profile/profile.entity';
import { TokenCache } from '../auth/entities/token-cache/token-cache.entity';

export const TYPEORM_DEFAULT_CONNECTION = 'default';

export function connectTypeorm(config: ConfigService): MongoConnectionOptions {
  const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';

  return {
    type: 'mongodb',
    name: TYPEORM_DEFAULT_CONNECTION,
    url: `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
      DB_PASSWORD,
    )}@${config.get(DB_HOST).replace(/,\s*$/, '')}/${config.get(DB_NAME)}`,
    logging: false,
    synchronize: true,
    entities: [ServerSettings, Profile, TokenCache],
    useNewUrlParser: true,
    w: 'majority',
    useUnifiedTopology: true,
    extra: { retryWrites: true },
  };
}
