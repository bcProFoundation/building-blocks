import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ModifyCloudStorageCommand } from './modify-cloud-storage.command';

@CommandHandler(ModifyCloudStorageCommand)
export class ModifyCloudStorageHandler
  implements ICommandHandler<ModifyCloudStorageCommand> {
  execute(command: ModifyCloudStorageCommand, resolve: (value?) => void) {
    resolve();
  }
}
