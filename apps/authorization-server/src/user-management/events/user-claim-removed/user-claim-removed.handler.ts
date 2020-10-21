import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserClaimService } from '../../../auth/entities/user-claim/user-claim.service';
import { UserClaimRemovedEvent } from './user-claim-removed.event';

@EventsHandler(UserClaimRemovedEvent)
export class UserClaimRemovedHandler
  implements IEventHandler<UserClaimRemovedEvent> {
  constructor(private readonly userClaim: UserClaimService) {}
  handle(event: UserClaimRemovedEvent) {
    const { claim } = event;

    this.userClaim
      .deleteOne({ uuid: claim.uuid, name: claim.name })
      .then(updated => {})
      .catch(error => {});
  }
}
