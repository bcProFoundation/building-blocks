import { INestApplication, Logger } from '@nestjs/common';
import { EventStoreServer } from './event-store/microservice/event-store.server';
import { ConfigService } from './config/config.service';

export const ES_STARTED_SUCCESSFULLY = 'Event Store started successfully';

export function setupEventStore(app: INestApplication) {
  const config = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  const { hostname, username, password, stream } = config.getEventStoreConfig();
  if (hostname && username && password && stream) {
    const eventStore = app.connectMicroservice({
      strategy: new EventStoreServer(config),
    });
    eventStore.listen(() =>
      logger.log(ES_STARTED_SUCCESSFULLY, eventStore.constructor.name),
    );
  }
}
