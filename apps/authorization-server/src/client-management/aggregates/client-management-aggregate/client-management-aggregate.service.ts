import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { ClientService } from '../../entities/client/client.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { OAuth2ClientRemovedEvent } from '../../events/oauth2client-removed/oauth2client-removed.event';
import {
  SCOPE_EMAIL,
  SCOPE_OPENID,
  SCOPE_ROLES,
  SCOPE_PROFILE,
} from '../../../constants/app-strings';
import { OAuth2ScopeRemovedEvent } from '../../events/oauth2scope-removed/oauth2scope-removed.event';
import { ScopeService } from '../../entities/scope/scope.service';
import { CreateClientDto } from '../../entities/client/create-client.dto';
import { ClientAddedEvent } from '../../events/client-added/client-added.event';
import { ClientModifiedEvent } from '../../events/client-modified/client-modified.event';
import { OnlyAllowValidScopeService } from '../../policies';
import { Client } from '../../entities/client/client.interface';
import { randomBytes32 } from '../../entities/client/client.schema';
import { ClientSecretUpdatedEvent } from '../../events/client-secret-updated/client-secret-updated.event';
import { ClientSecretVerifiedEvent } from '../../events/client-secret-verified/client-secret-verified.event';
import { CreateScopeDto } from '../../../user-management/policies';
import { OAuth2ScopeAddedEvent } from '../../events/oauth2scope-added/oauth2scope-added.event';
import { Scope } from '../../entities/scope/scope.interface';
import { invalidScopeException } from '../../../common/filters/exceptions';
import { OAuth2ScopeModifiedEvent } from '../../events/oauth2scope-modified/oauth2scope-modified.event';

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

    if (client.isTrusted) {
      throw new ForbiddenException({ isTrusted: client.isTrusted });
    }

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
    const clientsWithScope = await this.client.findAll({
      allowedScopes: scopeName,
    });
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
    const params: any = payload;
    if (!(await this.user.checkAdministrator(actorUuid))) {
      payload.isTrusted = 0;
    }

    if (payload.isTrusted) {
      params.autoApprove = true;
    }

    await this.onlyAllowValidScopeService.validate(payload.allowedScopes);

    params.createdBy = actorUuid;
    params.modifiedBy = actorUuid;
    params.creation = new Date();
    params.modified = params.creation;
    params.clientId = uuidv4();
    params.clientSecret = randomBytes32();

    this.apply(new ClientAddedEvent(params as Client));
    return params;
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

      if (payload.isTrusted) {
        client.autoApprove = true;
      }

      Object.assign(client, payload);
      client.modified = new Date();
      client.modifiedBy = actorUuid;
      this.apply(new ClientModifiedEvent(client));
      return client;
    } else {
      throw new UnauthorizedException();
    }
  }

  async updateClientSecret(clientId: string, userUuid: string) {
    const client = await this.client.findOne({ clientId });
    if (
      (await this.user.checkAdministrator(userUuid)) ||
      client.createdBy === userUuid
    ) {
      client.changedClientSecret = randomBytes32();
      client.modifiedBy = userUuid;
      client.modified = new Date();
      this.apply(new ClientSecretUpdatedEvent(client));
      return client;
    } else {
      throw new UnauthorizedException();
    }
  }

  async verifyChangedSecret(authorizationHeader) {
    try {
      const basicAuthHeader = authorizationHeader.split(' ')[1];
      const [clientId, changedClientSecret] = Buffer.from(
        basicAuthHeader,
        'base64',
      )
        .toString()
        .split(':');
      const client = await this.client.findOne({ clientId });

      if (client.changedClientSecret === changedClientSecret) {
        client.clientSecret = changedClientSecret;
        client.modified = new Date();

        this.apply(new ClientSecretVerifiedEvent(client));

        delete client.changedClientSecret;
        return client;
      } else throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async addScope(payload: CreateScopeDto, userUuid: string) {
    const scopeName = payload.name.toLowerCase().trim();
    const checkScope = await this.scope.findOne({ name: scopeName });
    if (checkScope) throw invalidScopeException;

    const scope = payload as Scope;
    this.apply(new OAuth2ScopeAddedEvent(scope, userUuid));
    return scope;
  }

  async modifyScope(payload: CreateScopeDto, userUuid: string, uuid: string) {
    const scope = await this.scope.findOne({ uuid });
    if (!scope) new NotFoundException({ scopeUuid: uuid });

    if (scope.name !== payload.name) {
      const existingClientsWithScope = await this.client.find({
        allowedScopes: scope.name,
      });

      const existingScope = await this.scope.findOne({ name: payload.name });
      if (existingScope) throw invalidScopeException;
      if (existingClientsWithScope.length > 0) {
        throw new BadRequestException({
          existingClientsWithScope: existingClientsWithScope.map(client => ({
            clientId: client.clientId,
            name: client.name,
            allowedScopes: client.allowedScopes,
          })),
        });
      }
    }

    scope.name = payload.name;
    scope.description = payload.description;
    this.apply(new OAuth2ScopeModifiedEvent(scope, userUuid));
    return scope;
  }
}
