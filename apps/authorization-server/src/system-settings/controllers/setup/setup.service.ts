import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { AuthService } from '../../../auth/controllers/auth/auth.service';
import { KeyPairGeneratorService } from '../../../auth/schedulers';
import { Client } from '../../../client-management/entities/client/client.interface';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { Scope } from '../../../client-management/entities/scope/scope.interface';
import { ScopeService } from '../../../client-management/entities/scope/scope.service';
import { ClientModifiedEvent } from '../../../client-management/events/client-modified/client-modified.event';
import {
  ADMINISTRATOR,
  INFRASTRUCTURE_CONSOLE,
  SCOPE_EMAIL,
  SCOPE_OPENID,
  SCOPE_PHONE,
  SCOPE_PROFILE,
  SCOPE_ROLES,
} from '../../../constants/app-strings';
import { i18n } from '../../../i18n/i18n.config';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { RoleService } from '../../../user-management/entities/role/role.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { UserAccountModifiedEvent } from '../../../user-management/events/user-account-modified/user-account-modified.event';
import { UserAccountDto } from '../../../user-management/policies';

@Injectable()
export class SetupService extends AggregateRoot {
  constructor(
    private readonly scopeService: ScopeService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
    private readonly settingsService: ServerSettingsService,
    private readonly keyPairService: KeyPairGeneratorService,
  ) {
    super();
  }

  async setupInfrastructureClient(
    fullName: string,
    email: string,
    phone: string,
    infrastructureConsoleUrl: string,
    adminPassword: string,
    issuerUrl: string,
    organizationName: string,
  ) {
    const existingClients = await this.clientService.find({});
    const existingUsers = await this.userService.find();

    if (existingClients.length > 0 || existingUsers.length > 0) {
      throw new HttpException(
        i18n.__('Setup already complete'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.keyPairService.generateKeyPair();
    await this.createUser(fullName, email, phone, adminPassword);
    const client = await this.createClient(email, infrastructureConsoleUrl);

    await this.settingsService.save({
      issuerUrl,
      organizationName,
      infrastructureConsoleClientId: client.clientId,
    });
    return client;
  }

  /**
   * Creates Client as specified user's email and serverUrl
   *
   * @param email
   * @param callbackUrl
   */
  async createClient(email: string, infrastructureConsoleUrl: string) {
    const callbackUrls = [
      infrastructureConsoleUrl + '/index.html',
      infrastructureConsoleUrl + '/silent-refresh.html',
    ];

    const userDeleteEndpoint =
      infrastructureConsoleUrl + '/connect/v1/user_delete';
    const tokenDeleteEndpoint =
      infrastructureConsoleUrl + '/connect/v1/token_delete';

    const scope = (await this.scopeService.insertMany([
      { name: SCOPE_OPENID },
      { name: SCOPE_ROLES },
      { name: SCOPE_EMAIL },
      { name: SCOPE_PROFILE },
      { name: SCOPE_PHONE },
    ])) as Scope[];

    const createdBy = await this.userService.findOne({ email });
    const allowedScopes: string[] = scope.map(r => r.name);
    const client = {} as Client;
    client.redirectUris = callbackUrls;
    client.name = i18n.__(INFRASTRUCTURE_CONSOLE);
    client.allowedScopes = allowedScopes;
    client.createdBy = createdBy.uuid;
    client.modifiedBy = createdBy.uuid;
    client.isTrusted = 1;
    client.userDeleteEndpoint = userDeleteEndpoint;
    client.tokenDeleteEndpoint = tokenDeleteEndpoint;

    const response = await this.clientService.save(client);
    this.apply(new ClientModifiedEvent(response));
    return response.toObject({
      transform: (doc, ret, options) => {
        // user object has password, removed from response
        delete ret.createdBy;
        delete ret.modifiedBy;

        // delete ObjectId key
        delete ret._id;
      },
    });
  }

  async createUser(
    fullName: string,
    email: string,
    phone: string,
    adminPassword: string,
  ) {
    let adminRole = await this.roleService.findOne({ name: ADMINISTRATOR });
    if (!adminRole)
      adminRole = await this.roleService.save({ name: ADMINISTRATOR });
    const user: UserAccountDto = {
      name: fullName,
      email,
      password: adminPassword,
      phone,
    };
    const admin = await this.authService.setupAdministrator(user, [adminRole]);
    this.apply(new UserAccountModifiedEvent(admin));
    return admin;
  }
}
