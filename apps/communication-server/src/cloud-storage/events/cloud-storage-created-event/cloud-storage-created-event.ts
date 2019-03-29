import { IEvent } from '@nestjs/cqrs';
import { StorageValidationDto } from '../../../cloud-storage/policies';

export class CloudStorageCreatedEvent implements IEvent {
  constructor(public readonly cloudStoragePayload: StorageValidationDto) {}
}
