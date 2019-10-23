import { IEvent } from '@nestjs/cqrs';
import { Profile } from 'profile-management/entities/profile/profile.entity';

export class ProfileDeletedEvent implements IEvent {
  constructor(public readonly profile: Profile) {}
}
