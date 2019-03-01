import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AddCloudStorageCommand } from './add-cloud-storage.command';
import { CloudStorageAggregateService } from '../../../cloud-storage/aggregates/cloud-storage-aggregate/cloud-storage-aggregate.service';
import { from } from 'rxjs';

@CommandHandler(AddCloudStorageCommand)
export class AddCloudStorageHandler
  implements ICommandHandler<AddCloudStorageCommand> {
  constructor(
    private readonly manager: CloudStorageAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  execute(command: AddCloudStorageCommand, resolve: (value?) => void) {
    const { payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    from(this.manager.addCloudStorage(payload)).subscribe({
      next: success => resolve(aggregate.commit()),
      error: error => resolve(Promise.reject(error)),
    });
  }
}
