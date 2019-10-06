import {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  MONGO_URI_PREFIX,
} from '../config/config.service';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { ServerSettings } from '../system-settings/entities/server-settings/server-settings.entity';
import { TokenCache } from '../auth/entities/token-cache/token-cache.entity';
import { Service } from '../service-management/entities/service/service.entity';
import { ServiceType } from '../service-management/entities/service-type/service-type.entity';
import { BrandSettings } from '../organization-settings/entities/brand-settings/brand-settings.entity';

export function connectTypeorm(config): MongoConnectionOptions {
  const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
  const mongoOptions = 'useUnifiedTopology=true&retryWrites=true';
  return {
    type: 'mongodb',
    url: `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
      DB_PASSWORD,
    )}@${config.get(DB_HOST)}/${config.get(DB_NAME)}?${mongoOptions}`,
    logging: false,
    synchronize: true,
    entities: [ServerSettings, TokenCache, Service, ServiceType, BrandSettings],
    useNewUrlParser: true,
    w: 'majority',
  };
}
