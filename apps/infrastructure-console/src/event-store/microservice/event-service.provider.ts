import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import {
  ConfigService,
  BROADCAST_HOST,
  BROADCAST_PORT,
} from '../../config/config.service';

export const EVENT_SERVICE = 'EVENT_SERVICE';

export const EventServiceProvider = {
  provide: EVENT_SERVICE,
  useFactory: (config: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: config.get(BROADCAST_HOST),
        port: Number(config.get(BROADCAST_PORT)),
      },
    });
  },
  inject: [ConfigService],
};
