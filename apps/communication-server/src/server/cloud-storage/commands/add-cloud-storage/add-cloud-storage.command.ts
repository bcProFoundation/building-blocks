import { ICommand } from '@nestjs/cqrs';
import { StorageValidationDto } from '../../../cloud-storage/policies';

export class AddCloudStorageCommand implements ICommand {
  constructor(
    public readonly actorUuid: string,
    public readonly payload: StorageValidationDto,
  ) {}
}
