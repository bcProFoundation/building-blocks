import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import {
  DB_PASSWORD,
  DB_USER,
  DB_HOST,
  DB_NAME,
} from '../config/config.service';
import { ServerSettings } from '../system-settings/entities/server-settings/server-settings.entity';
import { Profile } from '../profile-management/entities/profile/profile.entity';
import { TokenCache } from '../auth/entities/token-cache/token-cache.entity';

export function connectTypeorm(config): MongoConnectionOptions {
  return {
    type: 'mongodb',
    url: `mongodb://${config.get(DB_USER)}:${config.get(
      DB_PASSWORD,
    )}@${config.get(DB_HOST)}/${config.get(DB_NAME)}?useUnifiedTopology=true`,
    logging: false,
    synchronize: true,
    entities: [ServerSettings, Profile, TokenCache],
    useNewUrlParser: true,
  };
}
