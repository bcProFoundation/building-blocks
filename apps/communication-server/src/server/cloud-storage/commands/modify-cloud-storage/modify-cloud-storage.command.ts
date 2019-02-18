import { ICommand } from '@nestjs/cqrs';
import { StorageValidationDto } from '../../../cloud-storage/policies';

export class ModifyCloudStorageCommand implements ICommand {
  constructor(
    public readonly actorUuid: string,
    public readonly uuid: string,
    public readonly payload: StorageValidationDto,
  ) {}
}
