import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { OAuth2ClientRemovedEvent } from '../../../client-management/events/oauth2client-removed/oauth2client-removed.event';
import {
  SCOPE_EMAIL,
  SCOPE_OPENID,
  SCOPE_ROLES,
} from '../../../constants/app-strings';
import { OAuth2ScopeRemovedEvent } from '../../../client-management/events/oauth2scope-removed/oauth2scope-removed.event';
import { ScopeService } from '../../../client-management/entities/scope/scope.service';

@Injectable()
export class ClientManagementAggregateService extends AggregateRoot {
  constructor(
    private readonly client: ClientService,
    private readonly bearerToken: BearerTokenService,
    private readonly scope: ScopeService,
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
        await this.bearerToken.deleteMany({ clientId: client.clientId });
        this.apply(new OAuth2ClientRemovedEvent(client, actorUuid));
      } else {
        throw new ForbiddenException();
      }
    }
  }

  async removeScope(scopeName: string, actorUuid: string) {
    const scope = await this.scope.findOne({ name: scopeName });
    const ClientModel = this.client.getModel();
    const clientsWithScope = await ClientModel.find({
      allowedScopes: scopeName,
    }).exec();
    if (!scope) throw new NotFoundException({ scope: scopeName });

    if ([SCOPE_EMAIL, SCOPE_OPENID, SCOPE_ROLES].includes(scope.name)) {
      throw new BadRequestException({ cannotDeleteScope: scope.name });
    }

    if (clientsWithScope.length > 0) {
      throw new BadRequestException({
        clientsWithScope: clientsWithScope.map(client => ({
          clientId: client.clientId,
          name: client.name,
          allowedScopes: client.allowedScopes,
          redirectUris: client.redirectUris,
        })),
      });
    }

    this.apply(new OAuth2ScopeRemovedEvent(scope, actorUuid));
  }
}
