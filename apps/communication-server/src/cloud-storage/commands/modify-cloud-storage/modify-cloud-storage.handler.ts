import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ModifyCloudStorageCommand } from './modify-cloud-storage.command';
import { ModifyCloudStorageAggregateService } from '../../aggregates/modify-cloud-storage-aggregate/modify-cloud-storage-aggregate.service';

@CommandHandler(ModifyCloudStorageCommand)
export class ModifyCloudStorageHandler
  implements ICommandHandler<ModifyCloudStorageCommand>
{
  constructor(
    private readonly manager: ModifyCloudStorageAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ModifyCloudStorageCommand) {
    const { uuid, modifyCloudParams: payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.addCloudStorage(uuid, payload);
    aggregate.commit();
  }
}
