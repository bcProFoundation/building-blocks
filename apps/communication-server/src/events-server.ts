import { INestApplication, Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { useEventClientFactory } from './common/events-microservice.client';
import {
  ConfigService,
  EVENTS_HOST,
  EVENTS_PASSWORD,
  EVENTS_PORT,
  EVENTS_PROTO,
  EVENTS_USER,
} from './config/config.service';

const LISTENING_TO_EVENTS = 'Listening to Events';

export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 10;

export function setupEvents(app: INestApplication) {
  const config = app.get<ConfigService>(ConfigService);
  if (
    config.get(EVENTS_PROTO) &&
    config.get(EVENTS_HOST) &&
    config.get(EVENTS_PORT) &&
    config.get(EVENTS_USER) &&
    config.get(EVENTS_PASSWORD)
  ) {
    const options = useEventClientFactory(config);
    const events = app.connectMicroservice<MicroserviceOptions>(options);
    events
      .listen()
      .then(() => Logger.log(LISTENING_TO_EVENTS, events.constructor.name));
  }
}
