import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CloudStorageModifiedEvent } from './cloud-storage-modified-event';
import { StorageService } from '../../entities/storage/storage.service';

@EventsHandler(CloudStorageModifiedEvent)
export class CloudStorageModifiedEventHandler
  implements IEventHandler<CloudStorageModifiedEvent>
{
  constructor(private readonly storageService: StorageService) {}

  async handle(event: CloudStorageModifiedEvent) {
    await this.storageService.updateOne(
      { uuid: event.uuid },
      { $set: event.cloudStorageUpdateParams },
    );
  }
}
