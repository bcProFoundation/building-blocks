import { CloudStorageCreatedEventHander } from './cloud-storage-created-event/cloud-storage-created-handler';
import { CloudStorageModifiedEventHandler } from './cloud-storage-modified-event/cloud-storage-modified-handler';
import { FileUploadedCloudBucketHandler } from './file-uploaded-cloud-bucket-event/file-uploaded-cloud-bucket-handler';

export const CloudStorageEvents = [
  CloudStorageCreatedEventHander,
  CloudStorageModifiedEventHandler,
  FileUploadedCloudBucketHandler,
];
