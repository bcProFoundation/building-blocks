import { ConfigService } from '../config/config.service';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { TokenCache } from '../auth/entities/token-cache/token-cache.entity';
import { EmailAccount } from '../email/entities/email-account/email-account.entity';
import { SocialKey } from '../oauth2-client/entities/social-key/social-key.entity';
import { SocialToken } from '../oauth2-client/entities/social-token/social-token.entity';
import { SMSGateway } from '../smsmessage/entities/sms-gateway/sms-gateway.entity';
import { ServerSettings } from '../system-settings/entities/server-settings/server-settings.entity';
import { QueueLog } from '../system-settings/entities/queue-log/queue-log.entity';
import { Storage } from '../cloud-storage/entities/storage/storage.entity';

const config = new ConfigService();

export const TYPEORM_CONNECTION: MongoConnectionOptions = {
  type: 'mongodb',
  name: 'default',
  host: config.get('DB_HOST'),
  database: config.get('DB_NAME'),
  username: config.get('DB_USER'),
  password: config.get('DB_PASSWORD'),
  logging: false,
  synchronize: true,
  entities: [
    TokenCache,
    EmailAccount,
    SocialKey,
    SocialToken,
    SMSGateway,
    ServerSettings,
    QueueLog,
    Storage,
  ],
  useNewUrlParser: true,
};
