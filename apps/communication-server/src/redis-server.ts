import { INestApplication, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  ConfigService,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_PROTO,
} from './config/config.service';

const LISTENING_TO_EVENTS = 'Listening to events using Redis';

export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 10;

export function setupRedis(app: INestApplication) {
  const config = app.get<ConfigService>(ConfigService);
  if (config.get(REDIS_HOST) && config.get(REDIS_PORT)) {
    const userCredentials = config.get(REDIS_PASSWORD)
      ? `user:${config.get(REDIS_PASSWORD)}@`
      : '';

    const redis = app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.REDIS,
      options: {
        url: `${config.get(REDIS_PROTO)}://${userCredentials}${config.get(
          REDIS_HOST,
        )}:${config.get(REDIS_PORT)}`,
        retryAttempts: RETRY_ATTEMPTS,
        retryDelay: RETRY_DELAY,
      },
    });
    redis.listen(() => Logger.log(LISTENING_TO_EVENTS, redis.constructor.name));
  }
}
