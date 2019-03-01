import { UploadFilesCloudBucketCommand } from './upload-files-cloud-bucket.command';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { UploadFilesCloudBucketAggregateService } from '../../aggregates/index';
import { from } from 'rxjs';

@CommandHandler(UploadFilesCloudBucketCommand)
export class UploadFilesCloudBucketHandler
  implements ICommandHandler<UploadFilesCloudBucketCommand> {
  constructor(
    private readonly manager: UploadFilesCloudBucketAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  execute(command: UploadFilesCloudBucketCommand, resolve: (value?) => void) {
    const {
      clientUploadedFile,
      storageSettings,
      clientHttpReq,
      fileUploadedPermissions,
    } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    from(
      this.manager.uploadFileToCloudBucket(
        clientUploadedFile,
        storageSettings,
        clientHttpReq,
        fileUploadedPermissions,
      ),
    ).subscribe({
      next: success => resolve(aggregate.commit()),
      error: error => resolve(Promise.reject(error)),
    });
  }
}
