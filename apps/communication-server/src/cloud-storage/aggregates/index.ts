import { CloudStorageAggregateService } from './cloud-storage-aggregate/cloud-storage-aggregate.service';
import { ModifyCloudStorageAggregateService } from './modify-cloud-storage-aggregate/modify-cloud-storage-aggregate.service';
import { UploadFilesCloudBucketAggregateService } from './upload-files-cloud-bucket-aggregate/upload-files-cloud-bucket-aggregate.service';

export const CloudStorageAggregates = [
  CloudStorageAggregateService,
  ModifyCloudStorageAggregateService,
  UploadFilesCloudBucketAggregateService,
];

export { UploadFilesCloudBucketAggregateService };
