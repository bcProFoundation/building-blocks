import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { DeleteFileFromStorageCommand } from './delete-file-from-storage.command';
import { UploadFilesCloudBucketAggregateService } from '../../aggregates';

@CommandHandler(DeleteFileFromStorageCommand)
export class DeleteFileFromStorageHandler
  implements ICommandHandler<DeleteFileFromStorageCommand>
{
  constructor(
    private readonly manager: UploadFilesCloudBucketAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteFileFromStorageCommand) {
    const { filename, storageUuid, req } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.deleteFileFromBucket(filename, storageUuid, req);
    aggregate.commit();
  }
}
