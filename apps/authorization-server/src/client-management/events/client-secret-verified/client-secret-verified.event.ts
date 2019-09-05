import { IEvent } from '@nestjs/cqrs';
import { Client } from '../../entities/client/client.interface';

export class ClientSecretVerifiedEvent implements IEvent {
  constructor(public readonly client: Client) {}
}
