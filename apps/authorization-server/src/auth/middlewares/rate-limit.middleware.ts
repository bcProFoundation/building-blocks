import rateLimit from 'express-rate-limit';
import MongoStore from 'rate-limit-mongo';

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
  return rateLimit({ store, max, windowMs });
}
