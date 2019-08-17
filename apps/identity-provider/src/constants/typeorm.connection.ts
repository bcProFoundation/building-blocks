import { ConfigService } from '../config/config.service';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { ServerSettings } from '../system-settings/entities/server-settings/server-settings.entity';
import { Profile } from '../profile-management/entities/profile/profile.entity';
import { TokenCache } from '../auth/entities/token-cache/token-cache.entity';

const config = new ConfigService();

export const TYPEORM_CONNECTION: MongoConnectionOptions = {
  type: 'mongodb',
  url: `mongodb://${config.get('DB_USER')}:${config.get(
    'DB_PASSWORD',
  )}@${config.get('DB_HOST')}/${config.get('DB_NAME')}?useUnifiedTopology=true`,
  logging: false,
  synchronize: true,
  entities: [ServerSettings, Profile, TokenCache],
  useNewUrlParser: true,
};
