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

export const TYPEORM_DEFAULT_CONNECTION = 'default';

export function connectTypeorm(config): MongoConnectionOptions {
  const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';

  return {
    type: 'mongodb',
    name: TYPEORM_DEFAULT_CONNECTION,
    url: `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
      DB_PASSWORD,
    )}@${config.get(DB_HOST).replace(/,\s*$/, '')}/${config.get(DB_NAME)}`,
    logging: false,
    synchronize: true,
    entities: [ServerSettings, TokenCache, Service, ServiceType, BrandSettings],
    useNewUrlParser: true,
    useUnifiedTopology: true,
    extra: { retryWrites: true },
  };
}
