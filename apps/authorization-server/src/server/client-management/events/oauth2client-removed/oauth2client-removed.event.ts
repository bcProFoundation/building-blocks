import { IEvent } from '@nestjs/cqrs';
import { Client } from '../../../client-management/entities/client/client.interface';

export class OAuth2ClientRemovedEvent implements IEvent {
  constructor(
    public readonly client: Client,
    public readonly actorUserUuid: string,
  ) {}
}
