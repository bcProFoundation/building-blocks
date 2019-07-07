import { UploadFilesCloudBucketCommand } from './upload-files-cloud-bucket.command';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { UploadFilesCloudBucketAggregateService } from '../../aggregates/index';

@CommandHandler(UploadFilesCloudBucketCommand)
export class UploadFilesCloudBucketHandler
  implements ICommandHandler<UploadFilesCloudBucketCommand> {
  constructor(
    private readonly manager: UploadFilesCloudBucketAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UploadFilesCloudBucketCommand) {
    const {
      clientUploadedFile,
      storageUuid,
      clientHttpReq,
      fileUploadedPermissions,
    } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.uploadFileToCloudBucket(
      clientUploadedFile,
      storageUuid,
      clientHttpReq,
      fileUploadedPermissions,
    );
    aggregate.commit();
  }
}
