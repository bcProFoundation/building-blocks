import * as mongoose from 'mongoose';
import {
  ConfigService,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
} from '../config/config.service';

export const MONGOOSE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProviders = [
  {
    provide: MONGOOSE_CONNECTION,
    useFactory: (config: ConfigService): Promise<typeof mongoose> =>
      mongoose.connect(
        `mongodb://${config.get(DB_USER)}:${config.get(
          DB_PASSWORD,
        )}@${config.get(DB_HOST)}/${config.get(
          DB_NAME,
        )}?useUnifiedTopology=true`,
        { useNewUrlParser: true },
      ),
    inject: [ConfigService],
  },
];
