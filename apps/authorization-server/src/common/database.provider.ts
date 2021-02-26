import { Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Observable, defer } from 'rxjs';
import { retryWhen, scan, delay } from 'rxjs/operators';
import * as Agenda from 'agenda';
import * as RateLimitMongoStore from 'rate-limit-mongo';
import { default as ConnectMongo } from 'connect-mongo';

import {
  ConfigService,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  MONGO_URI_PREFIX,
} from '../config/config.service';
import { SESSION_COLLECTION } from '../auth/entities/session/session.schema';

export const MONGOOSE_CONNECTION = 'DATABASE_CONNECTION';
export const AGENDA_CONNECTION = 'AGENDA_CONNECTION';
export const RATE_LIMIT_CONNECTION = 'RATE_LIMIT_CONNECTION';
export const RATE_LIMIT_COLLECTION = 'rate_limit';
export const SESSION_CONNECTION = 'SESSION_CONNECTION';

export const databaseProviders = [
  {
    provide: MONGOOSE_CONNECTION,
    useFactory: async (config: ConfigService): Promise<typeof mongoose> => {
      const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
      const mongoOptions = 'retryWrites=true';
      return await defer(() =>
        mongoose.connect(
          `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
            DB_PASSWORD,
          )}@${config.get(DB_HOST).replace(/,\s*$/, '')}/${config.get(
            DB_NAME,
          )}?${mongoOptions}`,
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoReconnect: false,
            reconnectTries: 0,
            reconnectInterval: 0,
            useCreateIndex: true,
          },
        ),
      )
        .pipe(handleRetry())
        .toPromise();
    },
    inject: [ConfigService],
  },
  {
    provide: AGENDA_CONNECTION,
    useFactory: async (config: ConfigService) => {
      const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
      const agenda = new Agenda({
        db: {
          address: `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
            DB_PASSWORD,
          )}@${config.get(DB_HOST).replace(/,\s*$/, '')}/${config.get(
            DB_NAME,
          )}`,
          options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoReconnect: false,
            reconnectTries: 0,
            reconnectInterval: 0,
          },
        },
      });
      await agenda.start();
      return agenda;
    },
    inject: [ConfigService],
  },
  {
    provide: RATE_LIMIT_CONNECTION,
    useFactory: async (config: ConfigService) => {
      const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
      const store = new RateLimitMongoStore({
        uri: `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
          DB_PASSWORD,
        )}@${config.get(DB_HOST).replace(/,\s*$/, '')}/${config.get(DB_NAME)}`,
        collectionName: RATE_LIMIT_COLLECTION,
      });

      return store;
    },
    inject: [ConfigService],
  },
  {
    provide: SESSION_CONNECTION,
    useFactory: async (config: ConfigService) => {
      const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
      const mongoOptions = 'retryWrites=true';
      const store = ConnectMongo.create({
        mongoUrl: `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
          DB_PASSWORD,
        )}@${config.get(DB_HOST).replace(/,\s*$/, '')}/${config.get(
          DB_NAME,
        )}?${mongoOptions}`,
        touchAfter: 24 * 3600, // 24 hours * 3600 secs
        collectionName: SESSION_COLLECTION,
        stringify: false,
        mongoOptions: {
          useUnifiedTopology: true,
          // w: MAJORITY,
          useNewUrlParser: true,
        },
      });
      return store;
    },
    inject: [ConfigService],
  },
];

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
): <T>(source: Observable<T>) => Observable<T> {
  return <T>(source: Observable<T>) =>
    source.pipe(
      retryWhen(e =>
        e.pipe(
          scan((errorCount, error) => {
            Logger.error(
              `Unable to connect to the database. Retrying (${
                errorCount + 1
              })...`,
              '',
              'DatabaseProvider',
            );
            if (errorCount + 1 >= retryAttempts) {
              throw error;
            }
            return errorCount + 1;
          }, 0),
          delay(retryDelay),
        ),
      ),
    );
}
