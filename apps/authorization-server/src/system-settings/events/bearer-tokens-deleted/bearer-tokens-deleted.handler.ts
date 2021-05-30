import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { HttpService } from '@nestjs/common';
import { BearerTokensDeletedEvent } from './bearer-tokens-deleted.event';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { TOKEN_DELETE_QUEUE } from '../../../auth/schedulers/token-schedule/token-schedule.service';
import { retry } from 'rxjs/operators';

@EventsHandler(BearerTokensDeletedEvent)
export class BearerTokensDeletedHandler
  implements IEventHandler<BearerTokensDeletedEvent>
{
  constructor(
    private readonly bearerToken: BearerTokenService,
    private readonly client: ClientService,
    private readonly http: HttpService,
  ) {}

  handle(event: BearerTokensDeletedEvent) {
    this.deleteTokens()
      .then(success => {})
      .catch(error => {});
  }

  async deleteTokens() {
    const tokens = await this.bearerToken.getAll();
    for (const token of tokens) {
      await this.bearerToken.remove(token);
      await this.informClients(token.accessToken);
    }
  }

  async informClients(accessToken: string) {
    const clients = await this.client.findAll();
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
            error: error => {
              // TODO: Log Error
            },
          });
      }
    }
  }
}
