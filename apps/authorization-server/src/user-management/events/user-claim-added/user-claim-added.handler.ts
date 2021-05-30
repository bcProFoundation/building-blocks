import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserClaimService } from '../../../auth/entities/user-claim/user-claim.service';
import { UserClaimAddedEvent } from './user-claim-added.event';

@EventsHandler(UserClaimAddedEvent)
export class UserClaimAddedHandler
  implements IEventHandler<UserClaimAddedEvent>
{
  constructor(private readonly userClaim: UserClaimService) {}
  handle(event: UserClaimAddedEvent) {
    const { claim } = event;

    this.userClaim
      .save(claim)
      .then(updated => {})
      .catch(error => {});
  }
}
