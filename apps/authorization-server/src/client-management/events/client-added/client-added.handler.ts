import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ClientAddedEvent } from './client-added.event';
import { ClientService } from '../../entities/client/client.service';

@EventsHandler(ClientAddedEvent)
export class ClientAddedHandler implements IEventHandler<ClientAddedEvent> {
  constructor(private readonly client: ClientService) {}
  handle(command: ClientAddedEvent) {
    const { client } = command;
    this.client
      .save(client)
      .then(modified => {})
      .catch(error => {});
  }
}
