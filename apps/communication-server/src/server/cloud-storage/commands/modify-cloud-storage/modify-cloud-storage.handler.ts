import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ModifyCloudStorageCommand } from './modify-cloud-storage.command';
import { from } from 'rxjs';
import { ModifyCloudStorageAggregateService } from '../../aggregates/modify-cloud-storage-aggregate/modify-cloud-storage-aggregate.service';

@CommandHandler(ModifyCloudStorageCommand)
export class ModifyCloudStorageHandler
  implements ICommandHandler<ModifyCloudStorageCommand> {
  constructor(
    private readonly manager: ModifyCloudStorageAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  execute(command: ModifyCloudStorageCommand, resolve: (value?) => void) {
    const { uuid, modifyCloudParams: payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    from(this.manager.addCloudStorage(uuid, payload)).subscribe({
      next: success => resolve(aggregate.commit()),
      error: error => resolve(Promise.reject(error)),
    });
  }
}
