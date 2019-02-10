import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { OAuth2ClientRemovedEvent } from '../../../client-management/events/oauth2client-removed/oauth2client-removed.event';

@Injectable()
export class ClientManagementAggregateService extends AggregateRoot {
  constructor(
    private readonly client: ClientService,
    private readonly bearerToken: BearerTokenService,
    // private readonly scope: ScopeService,
    private readonly user: UserService,
  ) {
    super();
  }

  async removeClient(clientId, actorUuid) {
    const client = await this.client.findOne({ clientId });
    if (!client) throw new NotFoundException({ clientId });
    if (client.isTrusted === 0) {
      if (
        client.createdBy === actorUuid ||
        (await this.user.checkAdministrator(actorUuid))
      ) {
        await client.remove();
        await this.bearerToken.deleteMany({ clientId: client.clientId });
        this.apply(new OAuth2ClientRemovedEvent(client, actorUuid));
      } else {
        throw new ForbiddenException();
      }
    }
  }
}
