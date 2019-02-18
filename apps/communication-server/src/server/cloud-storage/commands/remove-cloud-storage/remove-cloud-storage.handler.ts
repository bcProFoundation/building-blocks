import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveCloudStorageCommand } from './remove-cloud-storage.command';

@CommandHandler(RemoveCloudStorageCommand)
export class RemoveCloudStorageHandler
  implements ICommandHandler<RemoveCloudStorageCommand> {
  execute(command: RemoveCloudStorageCommand, resolve: (value?) => void) {
    resolve();
  }
}
