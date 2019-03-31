import { IEvent } from '@nestjs/cqrs';
import { StorageValidationDto } from '../../../cloud-storage/policies';

export class FileUploadedCloudBucketEvent implements IEvent {
  constructor(
    public readonly clientUploadedFile: any,
    public readonly storageSettings: StorageValidationDto,
    public readonly clientHttpReq: any,
    public readonly fileUploadedPermissions: string,
  ) {}
}
