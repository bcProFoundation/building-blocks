import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ClientSecretUpdatedEvent } from './client-secret-updated.event';
import { ClientService } from '../../entities/client/client.service';

@EventsHandler(ClientSecretUpdatedEvent)
export class ClientSecretUpdatedHandler
  implements IEventHandler<ClientSecretUpdatedEvent>
{
  constructor(private readonly client: ClientService) {}

  handle(command: ClientSecretUpdatedEvent) {
    const { client } = command;
    this.client
      .save(client)
      .then(secretUpdated => {})
      .catch(error => {});
  }
}
