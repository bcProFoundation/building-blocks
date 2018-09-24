import { ConfigService } from '../config/config.service';

const config = new ConfigService();

export const MONGOOSE_CONNECTION = {
  type: 'mongodb',
  host: config.get('DB_HOST'),
  database: config.get('DB_NAME'),
};
