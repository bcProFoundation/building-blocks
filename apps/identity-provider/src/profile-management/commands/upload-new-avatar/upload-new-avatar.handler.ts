import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';
import { ProfileManagerAggregateService } from '../../../profile-management/aggregates/profile-manager-aggregate/profile-manager-aggregate.service';
import { UploadNewAvatarCommand } from './upload-new-avatar.command';

@CommandHandler(UploadNewAvatarCommand)
export class UploadNewAvatarHandler
  implements ICommandHandler<UploadNewAvatarCommand>
{
  constructor(
    private readonly manager: ProfileManagerAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UploadNewAvatarCommand) {
    const { avatarFile, clientHttpRequest: clientHttpRequest } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await lastValueFrom(
      this.manager.uploadNewAvatar(avatarFile, clientHttpRequest),
    );
    aggregate.commit();
  }
}
