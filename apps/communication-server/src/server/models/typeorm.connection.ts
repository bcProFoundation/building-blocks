import { Client } from './client/client.entity';
import { User } from './user/user.entity';
import { ConfigService } from '../config/config.service';
import { EmailAccount } from './email-account/email-account.entity';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

const config = new ConfigService();

export const TYPEORM_CONNECTION: MongoConnectionOptions = {
  type: 'mongodb',
  name: 'default',
  host: config.get('DB_HOST'),
  database: config.get('DB_NAME'),
  logging: false,
  synchronize: true,
  entities: [Client, User, EmailAccount],
};
