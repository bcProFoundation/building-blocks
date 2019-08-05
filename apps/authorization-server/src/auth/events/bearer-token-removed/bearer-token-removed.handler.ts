import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { BearerTokenRemovedEvent } from './bearer-token-removed.event';
import { HttpService } from '@nestjs/common';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { retry } from 'rxjs/operators';
import { TOKEN_DELETE_QUEUE } from '../../schedulers/token-schedule/token-schedule.service';

@EventsHandler(BearerTokenRemovedEvent)
export class BearerTokenRemovedHandler
  implements IEventHandler<BearerTokenRemovedEvent> {
  constructor(
    private readonly http: HttpService,
    private readonly client: ClientService,
  ) {}
  handle(event: BearerTokenRemovedEvent) {
    const { token } = event;
    const accessToken = token.accessToken;
    token
      .remove()
      .then(removed => {
        return this.informClients(accessToken);
      })
      .then(informed => {})
      .catch(error => {});
  }

  async informClients(accessToken: string) {
    const clientModel = this.client.getModel();
    const clients = await clientModel.find().exec();
    for (const client of clients) {
      if (client.tokenDeleteEndpoint) {
        this.http
          .post(
            client.tokenDeleteEndpoint,
            {
              message: TOKEN_DELETE_QUEUE,
              accessToken,
            },
            {
              auth: {
                username: client.clientId,
                password: client.clientSecret,
              },
            },
          )
          .pipe(retry(3))
          .subscribe({
            next: success => {},
            error: error => {},
          });
      }
    }
  }
}
