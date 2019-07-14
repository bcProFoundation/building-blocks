import { ConfigService } from '../config/config.service';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { ServerSettings } from '../system-settings/entities/server-settings/server-settings.entity';
import { TokenCache } from '../auth/entities/token-cache/token-cache.entity';
import { Service } from '../service-management/entities/service/service.entity';
import { ServiceType } from '../service-management/entities/service-type/service-type.entity';
import { BrandSettings } from '../organization-settings/entities/brand-settings/brand-settings.entity';

const config = new ConfigService();

export const TYPEORM_CONNECTION: MongoConnectionOptions = {
  type: 'mongodb',
  host: config.get('DB_HOST'),
  database: config.get('DB_NAME'),
  username: config.get('DB_USER'),
  password: config.get('DB_PASSWORD'),
  logging: false,
  synchronize: true,
  entities: [ServerSettings, TokenCache, Service, ServiceType, BrandSettings],
  useNewUrlParser: true,
};
