import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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

  create(eventType: string, event: any) {
    if (this.config.get(BROADCAST_HOST) && this.config.get(BROADCAST_PORT)) {
      this.broadcast.emit(eventType, event);
    }
    return this.client.emit(eventType, event);
  }
}
