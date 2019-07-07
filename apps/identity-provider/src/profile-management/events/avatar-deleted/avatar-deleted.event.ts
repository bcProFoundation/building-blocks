import { IEvent } from '@nestjs/cqrs';
import { Profile } from '../../entities/profile/profile.entity';
import { BucketSettings } from '../new-avatar-uploaded/bucket-settings-interface';

export class AvatarDeletedEvent implements IEvent {
  constructor(
    public readonly profile: Profile,
    public readonly settings: BucketSettings,
  ) {}
}
