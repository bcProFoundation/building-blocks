import { Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Observable, defer } from 'rxjs';
import { retryWhen, scan, delay } from 'rxjs/operators';
import * as Agenda from 'agenda';
import {
  ConfigService,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  MONGO_URI_PREFIX,
} from '../config/config.service';

export const MONGOOSE_CONNECTION = 'DATABASE_CONNECTION';
export const AGENDA_CONNECTION = 'AGENDA_CONNECTION';
export const MAJORITY = 'majority';

export const databaseProviders = [
  {
    provide: MONGOOSE_CONNECTION,
    useFactory: async (config: ConfigService): Promise<typeof mongoose> => {
      // Remove Deprecation Warnings https://mongoosejs.com/docs/deprecations.html
      mongoose.set('retryWrites', true);
      const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
      return await defer(() =>
        mongoose.connect(
          `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
            DB_PASSWORD,
          )}@${config.get(DB_HOST)}/${config.get(DB_NAME)}`,
          {
            useNewUrlParser: true,
            w: MAJORITY,
            useUnifiedTopology: true,
            autoReconnect: false,
            reconnectTries: 0,
            reconnectInterval: 0,
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
          )}@${config.get(DB_HOST)}/${config.get(DB_NAME)}`,
          options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            w: MAJORITY,
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
              `Unable to connect to the database. Retrying (${errorCount +
                1})...`,
              '',
              'DatabaseModule',
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
