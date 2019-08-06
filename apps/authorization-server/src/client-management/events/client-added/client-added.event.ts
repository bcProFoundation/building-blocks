import { IEvent } from '@nestjs/cqrs';
import { Client } from '../../entities/client/client.interface';

export class ClientAddedEvent implements IEvent {
  constructor(public readonly client: Client) {}
}
