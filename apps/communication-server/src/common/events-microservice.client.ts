import {
  ClientsProviderAsyncOptions,
  Transport,
  MqttOptions,
} from '@nestjs/microservices';
import {
  ConfigService,
  EVENTS_HOST,
  EVENTS_PORT,
  EVENTS_PROTO,
  EVENTS_USER,
  EVENTS_PASSWORD,
  EVENTS_CLIENT_ID,
} from '../config/config.service';

export const BROADCAST_EVENT = 'BROADCAST_EVENT';

export const useEventClientFactory = (config: ConfigService): MqttOptions => {
  const url = `${config.get(EVENTS_PROTO)}://${config.get(
    EVENTS_USER,
  )}:${config.get(EVENTS_PASSWORD)}@${config.get(EVENTS_HOST)}:${config.get(
    EVENTS_PORT,
  )}`;
  const clientId = config.get(EVENTS_CLIENT_ID);
  return {
    transport: Transport.MQTT,
    options: { url, clientId },
  };
};

export const eventsClient: ClientsProviderAsyncOptions = {
  useFactory: useEventClientFactory,
  name: BROADCAST_EVENT,
  inject: [ConfigService],
};
