import {
  CustomTransportStrategy,
  Server,
  ReadPacket,
} from '@nestjs/microservices';
import { TCPClient } from 'geteventstore-promise';
import { Observable } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { EventStoreContext } from './event-store.context';

export class EventStoreServer extends Server
  implements CustomTransportStrategy {
  private stream: string;
  server: TCPClient;

  constructor(private readonly config: ConfigService) {
    super();
  }

  async listen(callback: () => void) {
    this.init();
    await this.subscribeEvents();
    callback && callback();
  }

  async close() {
    if (this.server) {
      await this.server.close();
    }
  }

  init() {
    const {
      hostname,
      username,
      password,
      stream,
    } = this.config.getEventStoreConfig();

    if (hostname && username && password && stream) {
      this.stream = stream;
      this.server = new TCPClient({
        hostname,
        port: 1113,
        credentials: { username, password },
      });
    }
  }

  async subscribeEvents() {
    if (this.server) {
      await this.server.subscribeToStream(
        this.stream,
        this.processEvent.bind(this),
      );
    }
  }

  async processEvent(subscription, payload) {
    const packet: ReadPacket = {
      data: payload,
      pattern: payload.eventType,
    };

    const eventStoreCtx = new EventStoreContext([this.stream]);

    await this.handleEvent(packet.pattern, packet, eventStoreCtx);
    await this.handleMessage(packet);
  }

  async handleEvent(pattern, packet, context) {
    // Mute Errors if EventPattern not found
    this.logger.error = (...args) => {};
    super.handleEvent(pattern, packet, context);
  }

  async handleMessage(packet: ReadPacket) {
    const pattern = JSON.stringify({ cmd: packet.pattern });

    const handler = this.getHandlerByPattern(pattern);
    if (!handler || handler.isEventHandler) {
      return;
    }

    const response$ = this.transformToObservable(
      await handler(packet.data),
    ) as Observable<any>;

    response$ && this.send(response$, data => {});
  }
}
