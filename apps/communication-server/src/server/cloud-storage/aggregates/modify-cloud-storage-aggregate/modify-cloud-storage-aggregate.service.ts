import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { CloudStorageModifiedEvent } from '../../events/cloud-storage-modified-event/cloud-storage-modified-event';

@Injectable()
export class ModifyCloudStorageAggregateService extends AggregateRoot {
  constructor() {
    super();
  }
  async addCloudStorage(uuid, cloudStoragePayload) {
    return await this.apply(
      new CloudStorageModifiedEvent(uuid, cloudStoragePayload),
    );
  }
}
