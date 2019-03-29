import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { FileUploadedCloudBucketEvent } from './file-uploaded-cloud-bucket-event';
import * as AWS from 'aws-sdk';
import {
  DEFAULT_BUCKET_STORAGE_PATH,
  PUBLIC,
  ACL_PUBLIC_PERMISSION,
} from '../../../constants/app-strings';

@EventsHandler(FileUploadedCloudBucketEvent)
export class FileUploadedCloudBucketHandler
  implements IEventHandler<FileUploadedCloudBucketEvent> {
  constructor() {}

  async handle(event: FileUploadedCloudBucketEvent) {
    const spacesEndpoint: any = new AWS.Endpoint(
      event.storageSettings.endpoint,
    );
    const s3 = new AWS.S3({
      region: event.storageSettings.region,
      endpoint: spacesEndpoint,
      accessKeyId: event.storageSettings.accessKey,
      secretAccessKey: event.storageSettings.secretKey,
    });
    let filePermissions = null;

    if (event.fileUploadedPermissions === PUBLIC) {
      filePermissions = ACL_PUBLIC_PERMISSION;
    }
    // Add a file to a Space
    const params = {
      ACL: filePermissions,
      Body: event.clientUploadedFile.buffer,
      Bucket: event.storageSettings.bucket,
      Key: DEFAULT_BUCKET_STORAGE_PATH + event.clientUploadedFile.originalname, // file.filename
    };
    s3.putObject(params, (err, data) => {});
  }
}
