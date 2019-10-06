import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  MONGO_URI_PREFIX,
} from '../config/config.service';
import { TokenCache } from '../auth/entities/token-cache/token-cache.entity';
import { EmailAccount } from '../email/entities/email-account/email-account.entity';
import { OAuth2Provider } from '../oauth2-client/entities/oauth2-provider/oauth2-provider.entity';
import { OAuth2Token } from '../oauth2-client/entities/oauth2-token/oauth2-token.entity';
import { SMSGateway } from '../smsmessage/entities/sms-gateway/sms-gateway.entity';
import { ServerSettings } from '../system-settings/entities/server-settings/server-settings.entity';
import { QueueLog } from '../system-settings/entities/queue-log/queue-log.entity';
import { Storage } from '../cloud-storage/entities/storage/storage.entity';

export function connectTypeorm(config): MongoConnectionOptions {
  const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
  const mongoOptions = 'useUnifiedTopology=true&retryWrites=true';
  return {
    url: `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
      DB_PASSWORD,
    )}@${config.get(DB_HOST)}/${config.get(DB_NAME)}?${mongoOptions}`,
    type: 'mongodb',
    name: 'default',
    logging: false,
    synchronize: true,
    entities: [
      TokenCache,
      EmailAccount,
      OAuth2Provider,
      OAuth2Token,
      SMSGateway,
      ServerSettings,
      QueueLog,
      Storage,
    ],
    useNewUrlParser: true,
    w: 'majority',
  };
}
