import { IEvent } from '@nestjs/cqrs';
import { Storage } from '../../entities/storage/storage.entity';

export class CloudStorageRemovedEvent implements IEvent {
  constructor(public readonly storage: Storage) {}
}
