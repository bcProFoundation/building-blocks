import { ConfigService } from '../config/config.service';
import { ServerSettings } from './server-settings/server-settings.entity';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { TokenCache } from './token-cache/token-cache.entity';

const config = new ConfigService();

export const TYPEORM_CONNECTION: MongoConnectionOptions = {
  type: 'mongodb',
  host: config.get('DB_HOST'),
  database: config.get('DB_NAME'),
  logging: false,
  synchronize: true,
  entities: [ServerSettings, TokenCache],
};
