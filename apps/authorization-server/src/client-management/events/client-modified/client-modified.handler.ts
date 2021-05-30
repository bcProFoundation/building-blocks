import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ClientModifiedEvent } from './client-modified.event';
import { ClientService } from '../../entities/client/client.service';

@EventsHandler(ClientModifiedEvent)
export class ClientModifiedHandler
  implements IEventHandler<ClientModifiedEvent>
{
  constructor(private readonly client: ClientService) {}

  handle(command: ClientModifiedEvent) {
    const { client } = command;
    this.client
      .save(client)
      .then(added => {})
      .catch(error => {});
  }
}
