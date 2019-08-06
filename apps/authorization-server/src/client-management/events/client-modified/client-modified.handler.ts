import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ClientModifiedEvent } from './client-modified.event';

@EventsHandler(ClientModifiedEvent)
export class ClientModifiedHandler
  implements IEventHandler<ClientModifiedEvent> {
  handle(command: ClientModifiedEvent) {
    const { client } = command;
    client
      .save()
      .then(added => {})
      .catch(error => {});
  }
}
