import { IEvent } from '@nestjs/cqrs';
import { ModifyStorageDto } from '../../policies/modify-cloud-storage-dto/modify-cloud-storage-dto';

export class CloudStorageModifiedEvent implements IEvent {
  constructor(
    public readonly uuid: string,
    public readonly cloudStorageUpdateParams: ModifyStorageDto,
  ) {}
}
