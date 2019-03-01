import { ICommand } from '@nestjs/cqrs';
import { StorageValidationDto } from '../../../cloud-storage/policies';

export class ModifyCloudStorageCommand implements ICommand {
  constructor(
    public readonly uuid: string,
    public readonly modifyCloudParams: StorageValidationDto,
  ) {}
}
