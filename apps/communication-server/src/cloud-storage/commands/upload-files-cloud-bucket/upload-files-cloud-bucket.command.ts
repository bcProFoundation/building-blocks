import { IEvent } from '@nestjs/cqrs';

export class UploadFilesCloudBucketCommand implements IEvent {
  constructor(
    public readonly clientUploadedFile: any,
    public readonly storageUuid: string,
    public readonly clientHttpReq: any,
    public readonly fileUploadedPermissions: string,
  ) {}
}
