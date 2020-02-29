import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';
import { CloudStorageCreatedEvent } from '../../events/cloud-storage-created-event/cloud-storage-created-event';
import { StorageService } from '../../entities/storage/storage.service';
import {
  INVALID_FILE_OR_STORAGE_UUID,
  INVALID_CLIENT,
} from '../../../constants/messages';

@Injectable()
export class CloudStorageAggregateService extends AggregateRoot {
  constructor(private readonly storage: StorageService) {
    super();
  }
  async addCloudStorage(cloudStoragePayload) {
    cloudStoragePayload.uuid = uuidv4();
    return await this.apply(new CloudStorageCreatedEvent(cloudStoragePayload));
  }

  async retrieveFile(
    fileName: string,
    storageUuid: string,
    req: unknown,
    expiry = 300,
  ) {
    this.validateAuthorizedRequest(req);
    const storage = await this.storage.findOne({ uuid: storageUuid });
    if (!storage) throw new NotFoundException({ storageUuid });
    if (!fileName) throw new BadRequestException(INVALID_FILE_OR_STORAGE_UUID);

    const s3 = new AWS.S3({
      region: storage.region,
      endpoint: storage.endpoint,
      accessKeyId: storage.accessKey,
      secretAccessKey: storage.secretKey,
    });

    return s3.getSignedUrl('getObject', {
      Bucket: storage.bucket,
      Key: `${storage.basePath}/${fileName}`,
      Expires: expiry, // default 5 minutes
    });
  }

  validateAuthorizedRequest(req) {
    if (!req.token.trustedClient || req.token.sub) {
      throw new ForbiddenException(INVALID_CLIENT);
    }
  }
}
