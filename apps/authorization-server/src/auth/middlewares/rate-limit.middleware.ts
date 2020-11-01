import * as RateLimit from 'express-rate-limit';
import * as MongoStore from 'rate-limit-mongo';

import { MAJORITY } from '../../common/database.provider';

/**
 *
 * @param max Maximum number of requests per time window, default 100
 * @param windowMs Time window for requests, default 15 minutes in milliseconds
 * @param config Injected instance of ConfigService
 */
export function rateLimiterMiddleware(
  max: number = 100,
  windowMs: number = 900000,
  store: MongoStore,
) {
  // defaults to max 100 requests per
  return new RateLimit({
    store,
    max,
    windowMs,
    connectionOptions: {
      useUnifiedTopology: true,
      w: MAJORITY,
      retryWrites: true,
      useNewUrlParser: true,
    },
  });
}
