import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UploadNewAvatarCommand } from './upload-new-avatar.command';
import { ProfileManagerAggregateService } from '../../../profile-management/aggregates/profile-manager-aggregate/profile-manager-aggregate.service';

@CommandHandler(UploadNewAvatarCommand)
export class UploadNewAvatarHandler
  implements ICommandHandler<UploadNewAvatarCommand> {
  constructor(
    private readonly manager: ProfileManagerAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UploadNewAvatarCommand) {
    const { avatarFile, clientHttpRequest: clientHttpRequest } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager
      .uploadNewAvatar(avatarFile, clientHttpRequest)
      .toPromise();
    aggregate.commit();
  }
}
