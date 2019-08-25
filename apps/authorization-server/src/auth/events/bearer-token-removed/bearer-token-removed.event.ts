import { IEvent } from '@nestjs/cqrs';
import { BearerToken } from '../../entities/bearer-token/bearer-token.interface';

export class BearerTokenRemovedEvent implements IEvent {
  constructor(public readonly token: BearerToken) {}
}
