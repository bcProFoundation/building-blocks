import { Logger } from '@nestjs/common';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import RateLimitMongoStore from 'rate-limit-mongo';
import { defer, lastValueFrom, Observable } from 'rxjs';
import { delay, retryWhen, scan } from 'rxjs/operators';
import { SESSION_COLLECTION } from '../auth/entities/session/session.schema';
import {
  ConfigService,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
  MONGO_URI_PREFIX,
} from '../config/config.service';

export const MONGOOSE_CONNECTION = 'DATABASE_CONNECTION';
export const RATE_LIMIT_CONNECTION = 'RATE_LIMIT_CONNECTION';
export const RATE_LIMIT_COLLECTION = 'rate_limit';
export const SESSION_CONNECTION = 'SESSION_CONNECTION';

export const databaseProviders = [
  {
    provide: MONGOOSE_CONNECTION,
    useFactory: async (config: ConfigService): Promise<typeof mongoose> => {
      const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
      const mongoOptions = 'retryWrites=true';
      return await lastValueFrom(
        defer(() =>
          mongoose.connect(
            `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
              DB_PASSWORD,
            )}@${config.get(DB_HOST).replace(/,\s*$/, '')}/${config.get(
              DB_NAME,
            )}?${mongoOptions}`,
          ),
        ).pipe(handleRetry()),
      );
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
      const store = MongoStore.create({
        mongoUrl: `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
          DB_PASSWORD,
        )}@${config.get(DB_HOST).replace(/,\s*$/, '')}/${config.get(
          DB_NAME,
        )}?${mongoOptions}`,
        touchAfter: 24 * 3600, // 24 hours * 3600 secs
        collectionName: SESSION_COLLECTION,
        stringify: false,
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
