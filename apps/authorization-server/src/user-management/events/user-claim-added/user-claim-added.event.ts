import { IEvent } from '@nestjs/cqrs';
import { UserClaim } from '../../../auth/entities/user-claim/user-claim.interface';

export class UserClaimAddedEvent implements IEvent {
  constructor(public readonly claim: UserClaim) {}
}
