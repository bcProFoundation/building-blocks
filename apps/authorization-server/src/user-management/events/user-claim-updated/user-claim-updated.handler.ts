import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserClaimService } from '../../../auth/entities/user-claim/user-claim.service';
import { UserClaimUpdatedEvent } from './user-claim-updated.event';

@EventsHandler(UserClaimUpdatedEvent)
export class UserClaimUpdatedHandler
  implements IEventHandler<UserClaimUpdatedEvent>
{
  constructor(private readonly userClaim: UserClaimService) {}

  handle(event: UserClaimUpdatedEvent) {
    const { claim } = event;

    this.userClaim
      .updateOne(
        { uuid: claim.uuid, name: claim.name },
        { $set: { scope: claim.scope, value: claim.value } },
      )
      .then(updated => {})
      .catch(error => {});
  }
}
