import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ScopeService } from '../../../models/scope/scope.service';
import { ClientService } from '../../../models/client/client.service';
import {
  SETUP_ALREADY_COMPLETE,
  INFRASTRUCTURE_CONSOLE,
} from '../../../constants/messages';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../../../models/user/create-user.dto';
import { UserService } from '../../../models/user/user.service';
import { randomBytes } from 'crypto';
import { RoleService } from '../../../models/role/role.service';
import { ServerSettingsService } from '../../../models/server-settings/server-settings.service';
import { Scope } from '../../../models/interfaces/scope.interface';
import { Client } from '../../../models/interfaces/client.interface';
import { KeyPairGeneratorService } from '../../../scheduler/keypair-generator.service';

@Injectable()
export class SetupService {
  constructor(
    private readonly scopeService: ScopeService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
    private readonly settingsService: ServerSettingsService,
    private readonly keyGenService: KeyPairGeneratorService,
  ) {}

  async setupInfrastructureClient(
    fullName: string,
    email: string,
    phone: string,
    infrastructureConsoleCallbackUrl: string[],
    adminPassword: string,
    issuerUrl: string,
  ) {
    const existingClients = await this.clientService.find();
    const existingUsers = await this.userService.find();

    if (existingClients.length > 0 || existingUsers.length > 0) {
      throw new HttpException(SETUP_ALREADY_COMPLETE, HttpStatus.UNAUTHORIZED);
    }
    await this.settingsService.save({ issuerUrl });
    await this.createUser(fullName, email, phone, adminPassword);
    await this.keyGenService.generateKeyPair();
    return await this.createClient(email, infrastructureConsoleCallbackUrl);
  }

  /**
   * Creates Client as specified user's email and serverUrl
   *
   * @param email
   * @param callbackUrl
   */
  async createClient(email: string, callbackUrls: string[]) {
    const ScopeModel = this.scopeService.getModel();
    const scope: Scope[] = await ScopeModel.insertMany([
      { name: 'openid' },
      { name: 'roles' },
      { name: 'email' },
    ]);
    const createdBy = await this.userService.findOne({ email });
    const allowedScopes: string[] = scope.map(r => r.name);
    const ClientModel = this.clientService.getModel();
    const client: Client = new ClientModel();
    client.clientSecret = randomBytes(32).toString('hex');
    client.redirectUris = callbackUrls;
    client.name = INFRASTRUCTURE_CONSOLE;
    client.allowedScopes = allowedScopes;
    client.createdBy = createdBy.uuid;
    client.modifiedBy = createdBy.uuid;
    client.isTrusted = 1;

    const response = await this.clientService.save(client);

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
    const adminRole = await this.roleService.save({ name: 'administrator' });
    const user: CreateUserDto = {
      name: fullName,
      email,
      password: adminPassword,
      phone,
    };
    return await this.authService.signUp(user, [adminRole]);
  }
}
