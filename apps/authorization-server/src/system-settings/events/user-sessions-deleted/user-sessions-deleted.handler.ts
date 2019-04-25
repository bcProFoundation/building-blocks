import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserSessionsDeletedEvent } from './user-sessions-deleted.event';
import { SessionService } from '../../../auth/entities/session/session.service';

@EventsHandler(UserSessionsDeletedEvent)
export class UserSessionsDeletedHandler
  implements IEventHandler<UserSessionsDeletedEvent> {
  constructor(private readonly session: SessionService) {}

  handle(event: UserSessionsDeletedEvent) {
    this.session
      .clear()
      .then(success => {})
      .catch(error => {});
  }
}
