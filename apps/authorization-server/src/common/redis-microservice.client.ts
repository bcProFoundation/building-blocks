import {
  ClientsProviderAsyncOptions,
  RedisOptions,
  Transport,
} from '@nestjs/microservices';
import {
  ConfigService,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_PROTO,
} from '../config/config.service';

export const BROADCAST_EVENT = 'BROADCAST_EVENT';
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 10;

export const redisClient: ClientsProviderAsyncOptions = {
  useFactory: (config: ConfigService): RedisOptions => {
    if (!config.get(REDIS_HOST) && !config.get(REDIS_PORT)) {
      return {};
    }

    const userCredentials = config.get(REDIS_PASSWORD)
      ? `:${config.get(REDIS_PASSWORD)}@`
      : '';

    return {
      transport: Transport.REDIS,
      options: {
        url: `${config.get(REDIS_PROTO)}://${userCredentials}${config.get(
          REDIS_HOST,
        )}:${config.get(REDIS_PORT)}`,
        retryAttempts: RETRY_ATTEMPTS,
        retryDelay: RETRY_DELAY,
      },
    };
  },
  name: BROADCAST_EVENT,
  inject: [ConfigService],
};
