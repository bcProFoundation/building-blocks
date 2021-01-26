import { CloudStorageCreatedEventHandler } from './cloud-storage-created-event/cloud-storage-created-handler';
import { CloudStorageModifiedEventHandler } from './cloud-storage-modified-event/cloud-storage-modified-handler';
import { FileUploadedCloudBucketHandler } from './file-uploaded-cloud-bucket-event/file-uploaded-cloud-bucket-handler';
import { BucketFileDeletedHandler } from './bucket-file-deleted/bucket-file-deleted.handler';
import { CloudStorageRemovedEventHandler } from './cloud-storage-removed-event/cloud-storage-removed-handler';

export const CloudStorageEvents = [
  CloudStorageCreatedEventHandler,
  CloudStorageModifiedEventHandler,
  FileUploadedCloudBucketHandler,
  BucketFileDeletedHandler,
  CloudStorageRemovedEventHandler,
];
