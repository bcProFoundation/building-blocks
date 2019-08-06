import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
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
  SCOPE_PROFILE,
} from '../../../constants/app-strings';
import { OAuth2ScopeRemovedEvent } from '../../../client-management/events/oauth2scope-removed/oauth2scope-removed.event';
import { ScopeService } from '../../../client-management/entities/scope/scope.service';
import { CreateClientDto } from '../../../client-management/entities/client/create-client.dto';
import { ClientAddedEvent } from '../../../client-management/events/client-added/client-added.event';
import { ClientModifiedEvent } from '../../../client-management/events/client-modified/client-modified.event';
import { OnlyAllowValidScopeService } from '../../../client-management/policies';

@Injectable()
export class ClientManagementAggregateService extends AggregateRoot {
  constructor(
    private readonly client: ClientService,
    private readonly bearerToken: BearerTokenService,
    private readonly scope: ScopeService,
    private readonly user: UserService,
    private readonly onlyAllowValidScopeService: OnlyAllowValidScopeService,
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

    if (
      [SCOPE_EMAIL, SCOPE_OPENID, SCOPE_ROLES, SCOPE_PROFILE].includes(
        scope.name,
      )
    ) {
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

  async addClient(payload: CreateClientDto, actorUuid: string) {
    const ClientModel = this.client.getModel();
    const params: any = payload;
    if (!(await this.user.checkAdministrator(actorUuid))) {
      payload.isTrusted = 0;
    }

    await this.onlyAllowValidScopeService.validate(payload.allowedScopes);

    params.createdBy = actorUuid;
    params.modifiedBy = actorUuid;
    params.creation = new Date();
    params.modified = params.creation;
    const client = new ClientModel(params);
    this.apply(new ClientAddedEvent(client));
    return client;
  }

  async modifyClient(
    clientId: string,
    payload: CreateClientDto,
    actorUuid: string,
  ) {
    const client = await this.client.findOne({ clientId });
    if (
      (await this.user.checkAdministrator(actorUuid)) ||
      client.createdBy === actorUuid
    ) {
      await this.onlyAllowValidScopeService.validate(payload.allowedScopes);

      Object.assign(client, payload);
      client.modified = new Date();
      client.modifiedBy = actorUuid;
      this.apply(new ClientModifiedEvent(client));
      return client;
    } else {
      throw new UnauthorizedException();
    }
  }
}
