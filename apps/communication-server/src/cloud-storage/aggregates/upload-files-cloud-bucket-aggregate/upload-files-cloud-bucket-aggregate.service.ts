import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { FileUploadedCloudBucketEvent } from '../../events/file-uploaded-cloud-bucket-event/file-uploaded-cloud-bucket-event';
import {
  INVALID_FILE_OR_STORAGE_UUID,
  INVALID_CLIENT,
} from '../../../constants/messages';
import { StorageService } from '../../entities/storage/storage.service';
import { BucketFileDeletedEvent } from '../../events/bucket-file-deleted/bucket-file-deleted.event';

@Injectable()
export class UploadFilesCloudBucketAggregateService extends AggregateRoot {
  constructor(private readonly storage: StorageService) {
    super();
  }

  async uploadFileToCloudBucket(
    clientUploadedFile,
    storageUuid,
    clientHttpReq,
    fileUploadedPermissions,
  ) {
    const cloudStorageSettings = await this.validateBucket(
      storageUuid,
      clientHttpReq,
      clientUploadedFile,
    );

    if (cloudStorageSettings) {
      this.apply(
        new FileUploadedCloudBucketEvent(
          clientUploadedFile,
          cloudStorageSettings,
          clientHttpReq,
          fileUploadedPermissions,
        ),
      );
    }
  }

  async deleteFileFromBucket(filename: string, storageUuid: string, req: any) {
    const cloudStorageSettings = await this.validateBucket(
      storageUuid,
      req,
      filename,
    );
    if (cloudStorageSettings) {
      this.apply(
        new BucketFileDeletedEvent(filename, cloudStorageSettings, req),
      );
    }
  }

  async validateBucket(storageUuid: string, clientHttpReq, clientUploadedFile) {
    const cloudStorageSettings = await this.storage.findOne({
      uuid: storageUuid,
    });

    if (!clientHttpReq.token.trustedClient || clientHttpReq.token.sub) {
      throw new ForbiddenException(INVALID_CLIENT);
    }

    if (!clientUploadedFile || !cloudStorageSettings) {
      throw new BadRequestException(INVALID_FILE_OR_STORAGE_UUID);
    }

    return cloudStorageSettings;
  }
}
