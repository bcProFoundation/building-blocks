import { ConfigService } from '../config/config.service';
import { IdentityProviderSettings } from './identity-provider-settings/identity-provider-settings.entity';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { Profile } from './profile/profile.entity';

const config = new ConfigService();

export const TYPEORM_CONNECTION: MongoConnectionOptions = {
  type: 'mongodb',
  host: config.get('DB_HOST'),
  database: config.get('DB_NAME'),
  logging: false,
  synchronize: true,
  entities: [IdentityProviderSettings, Profile],
};
