import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CloudStorageCreatedEvent } from './cloud-storage-created-event';
import { StorageService } from '../../entities/storage/storage.service';

@EventsHandler(CloudStorageCreatedEvent)
export class CloudStorageCreatedEventHandler
  implements IEventHandler<CloudStorageCreatedEvent>
{
  constructor(private readonly storageService: StorageService) {}
  async handle(event: CloudStorageCreatedEvent) {
    await this.storageService.save(event.cloudStoragePayload);
  }
}
