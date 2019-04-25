import { IEvent } from '@nestjs/cqrs';

export class BearerTokensDeletedEvent implements IEvent {
  constructor(public readonly actorUuid: string) {}
}
