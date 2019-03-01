import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { FileUploadedCloudBucketEvent } from '../../events/file-uploaded-cloud-bucket-event/file-uploaded-cloud-bucket-event';

@Injectable()
export class UploadFilesCloudBucketAggregateService extends AggregateRoot {
  constructor() {
    super();
  }

  async uploadFileToCloudBucket(
    clientUploadedFile,
    storageSettings,
    clientHttpReq,
    fileUploadedPermissions,
  ) {
    this.apply(
      new FileUploadedCloudBucketEvent(
        clientUploadedFile,
        storageSettings,
        clientHttpReq,
        fileUploadedPermissions,
      ),
    );
  }
}
