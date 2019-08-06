import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ClientAddedEvent } from './client-added.event';

@EventsHandler(ClientAddedEvent)
export class ClientAddedHandler implements IEventHandler<ClientAddedEvent> {
  constructor() {}
  handle(command: ClientAddedEvent) {
    const { client } = command;
    client
      .save()
      .then(modified => {})
      .catch(error => {});
  }
}
