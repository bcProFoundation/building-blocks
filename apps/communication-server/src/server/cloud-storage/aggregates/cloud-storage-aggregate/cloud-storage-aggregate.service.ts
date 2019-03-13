import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { CloudStorageCreatedEvent } from '../../events/cloud-storage-created-event/cloud-storage-created-event';
import * as uuidv4 from 'uuid/v4';

@Injectable()
export class CloudStorageAggregateService extends AggregateRoot {
  constructor() {
    super();
  }
  async addCloudStorage(cloudStoragePayload) {
    cloudStoragePayload.uuid = uuidv4();
    return await this.apply(new CloudStorageCreatedEvent(cloudStoragePayload));
  }
}
