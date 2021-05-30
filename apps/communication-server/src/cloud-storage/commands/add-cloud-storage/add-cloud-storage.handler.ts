import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AddCloudStorageCommand } from './add-cloud-storage.command';
import { CloudStorageAggregateService } from '../../../cloud-storage/aggregates/cloud-storage-aggregate/cloud-storage-aggregate.service';

@CommandHandler(AddCloudStorageCommand)
export class AddCloudStorageHandler
  implements ICommandHandler<AddCloudStorageCommand>
{
  constructor(
    private readonly manager: CloudStorageAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: AddCloudStorageCommand) {
    const { payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.addCloudStorage(payload);
    aggregate.commit();
  }
}
