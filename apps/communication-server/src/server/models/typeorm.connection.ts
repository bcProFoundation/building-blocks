import { ConfigService } from '../config/config.service';
import { EmailAccount } from './email-account/email-account.entity';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { ServerSettings } from './server-settings/server-settings.entity';

const config = new ConfigService();

export const TYPEORM_CONNECTION: MongoConnectionOptions = {
  type: 'mongodb',
  name: 'default',
  host: config.get('DB_HOST'),
  database: config.get('DB_NAME'),
  logging: false,
  synchronize: true,
  entities: [EmailAccount, ServerSettings],
};
