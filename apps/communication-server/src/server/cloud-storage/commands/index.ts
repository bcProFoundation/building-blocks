import { AddCloudStorageHandler } from './add-cloud-storage/add-cloud-storage.handler';
import { ModifyCloudStorageHandler } from './modify-cloud-storage/modify-cloud-storage.handler';
import { RemoveCloudStorageHandler } from './remove-cloud-storage/remove-cloud-storage.handler';
import { UploadFilesCloudBucketHandler } from './upload-files-cloud-bucket/upload-files-cloud-bucket.handler';

export const CloudStorageCommands = [
  AddCloudStorageHandler,
  ModifyCloudStorageHandler,
  RemoveCloudStorageHandler,
  UploadFilesCloudBucketHandler,
];
