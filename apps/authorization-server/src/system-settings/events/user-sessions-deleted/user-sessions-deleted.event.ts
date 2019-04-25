import { IEvent } from '@nestjs/cqrs';

export class UserSessionsDeletedEvent implements IEvent {
  constructor(public readonly actorUuid: string) {}
}
