import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ClientSecretVerifiedEvent } from './client-secret-verified.event';
import { ClientService } from '../../entities/client/client.service';

@EventsHandler(ClientSecretVerifiedEvent)
export class ClientSecretVerifiedHandler
  implements IEventHandler<ClientSecretVerifiedEvent> {
  constructor(private readonly client: ClientService) {}

  handle(command: ClientSecretVerifiedEvent) {
    const { client } = command;
    this.client
      .save(client)
      .then(secretVerified => {
        return this.client.updateOne(
          { clientId: client.clientId },
          { $unset: { changedClientSecret: 1 } },
        );
      })
      .then(clientUpdated => {})
      .catch(error => {});
  }
}
