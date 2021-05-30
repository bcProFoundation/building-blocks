import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CloudStorageRemovedEvent } from './cloud-storage-removed-event';
import { StorageService } from '../../entities/storage/storage.service';

@EventsHandler(CloudStorageRemovedEvent)
export class CloudStorageRemovedEventHandler
  implements IEventHandler<CloudStorageRemovedEvent>
{
  constructor(private readonly storageService: StorageService) {}
  async handle(event: CloudStorageRemovedEvent) {
    await this.storageService.delete({ uuid: event?.storage?.uuid });
  }
}
