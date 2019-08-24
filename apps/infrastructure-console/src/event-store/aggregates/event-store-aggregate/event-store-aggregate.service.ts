import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventStoreClient } from '../../microservice/event-store.client';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class EventStoreAggregateService
  implements OnModuleInit, OnModuleDestroy {
  private client: EventStoreClient;
  constructor(private readonly config: ConfigService) {
    this.client = new EventStoreClient(this.config);
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  create(eventType: string, payload: any) {
    return this.client.emit(eventType, payload);
  }
}
