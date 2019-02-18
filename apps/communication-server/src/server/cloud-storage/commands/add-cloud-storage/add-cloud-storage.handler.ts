import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddCloudStorageCommand } from './add-cloud-storage.command';

@CommandHandler(AddCloudStorageCommand)
export class AddCloudStorageHandler
  implements ICommandHandler<AddCloudStorageCommand> {
  execute(command: AddCloudStorageCommand, resolve: (value?) => void) {
    resolve();
  }
}
