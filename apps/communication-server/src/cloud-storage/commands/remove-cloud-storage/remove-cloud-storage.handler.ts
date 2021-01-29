import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CloudStorageAggregateService } from '../../aggregates/cloud-storage-aggregate/cloud-storage-aggregate.service';
import { RemoveCloudStorageCommand } from './remove-cloud-storage.command';

@CommandHandler(RemoveCloudStorageCommand)
export class RemoveCloudStorageHandler
  implements ICommandHandler<RemoveCloudStorageCommand> {
  constructor(
    private readonly manager: CloudStorageAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveCloudStorageCommand) {
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const response = await aggregate.removeStorage(command?.uuid);
    aggregate.commit();
    return response;
  }
}
