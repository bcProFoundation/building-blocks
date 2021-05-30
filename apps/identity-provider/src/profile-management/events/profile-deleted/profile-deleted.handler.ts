import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProfileDeletedEvent } from './profile-deleted.event';
import { ProfileService } from '../../entities/profile/profile.service';

@EventsHandler(ProfileDeletedEvent)
export class ProfileDeletedHandler
  implements IEventHandler<ProfileDeletedEvent>
{
  constructor(private readonly profile: ProfileService) {}
  async handle(event: ProfileDeletedEvent) {
    const { profile } = event;
    await this.profile.deleteProfile(profile.uuid);
  }
}
