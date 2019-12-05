import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  BadGatewayException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ReadDirection } from 'geteventstore-promise';
import { EventStoreClient } from '../../microservice/event-store.client';
import {
  ConfigService,
  BROADCAST_HOST,
  BROADCAST_PORT,
} from '../../../config/config.service';
import { EVENT_SERVICE } from '../../microservice/event-service.provider';

@Injectable()
export class EventStoreAggregateService
  implements OnModuleInit, OnModuleDestroy {
  private client: EventStoreClient;
  constructor(
    @Inject(EVENT_SERVICE) private readonly broadcast: ClientProxy,
    private readonly config: ConfigService,
  ) {
    this.client = new EventStoreClient(this.config);
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  create(eventType: string, payload: any) {
    if (this.config.get(BROADCAST_HOST) && this.config.get(BROADCAST_PORT)) {
      this.broadcast.emit(eventType, event);
    }
    return this.client.emit(eventType, payload);
  }

  async list(
    page: number,
    length: number,
    direction: ReadDirection = 'forward',
    type?: string[],
    stream?: string,
  ) {
    if (!this.client.connection) {
      throw new BadGatewayException({ connection: false });
    }

    let docs = [];
    page = Number(page);
    length = Number(length);
    if (!page) page = 0;
    if (!length) length = 20;

    if (type && type.length > 0) {
      docs = await this.client.connection.getEventsByType(
        stream || this.client.stream,
        type,
        page,
        length,
        direction,
      );

      return this.paginate(docs, page, length);
    }

    docs = await this.client.connection.getEvents(
      stream || this.client.stream,
      page,
      length,
      direction,
    );

    return this.paginate(docs, page, length);
  }

  paginate(docs: any[], offset: number, length: number) {
    return { docs, length, offset };
  }
}
