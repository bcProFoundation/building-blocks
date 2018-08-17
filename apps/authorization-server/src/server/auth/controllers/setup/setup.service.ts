import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ScopeService } from '../../../models/scope/scope.service';
import { ClientService } from '../../../models/client/client.service';
import {
  SETUP_ALREADY_COMPLETE,
  INFRASTRUCTURE_CONSOLE,
} from '../../../constants/messages';
import { Client } from '../../../models/client/client.entity';
import { Scope } from '../../../models/scope/scope.entity';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../../../models/user/create-user.dto';
import { UserService } from '../../../models/user/user.service';
import { randomBytes } from 'crypto';
import { RoleService } from '../../../models/role/role.service';

@Injectable()
export class SetupService {
  constructor(
    private readonly scopeService: ScopeService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
  ) {}

  async setupInfrastructureClient(
    fullName: string,
    email: string,
    serverUrl: string,
    adminPassword: string,
  ) {
    const existingClients = await this.clientService.find();
    const existingUsers = await this.userService.find();

    if (existingClients.length > 0 || existingUsers.length > 0) {
      throw new HttpException(SETUP_ALREADY_COMPLETE, HttpStatus.UNAUTHORIZED);
    }

    await this.createUser(fullName, email, adminPassword);
    return await this.createClient(email, serverUrl);
  }

  /**
   * Creates Client as specified user's email and serverUrl
   *
   * @param email
   * @param serverUrl
   */
  async createClient(email: string, serverUrl: string) {
    const openid: Scope = await this.scopeService.save({ name: 'openid' });
    const roles: Scope = await this.scopeService.save({ name: 'roles' });
    const createdBy = await this.userService.findOne({ email });

    const allowedScopes: Scope[] = [];
    allowedScopes.push(openid);
    allowedScopes.push(roles);

    const client = new Client();
    client.clientSecret = randomBytes(32).toString('hex');
    client.redirectUris = [`${serverUrl}/auth/callback`];
    client.name = INFRASTRUCTURE_CONSOLE;
    client.allowedScopes = allowedScopes;
    client.createdBy = createdBy;
    client.modifiedBy = createdBy;
    client.isTrusted = 1;

    const response = await this.clientService.save(client);

    // user object has password, removed from response
    delete response.createdBy;
    delete response.modifiedBy;

    return response;
  }

  async createUser(fullName: string, email: string, adminPassword: string) {
    const adminRole = await this.roleService.save({ name: 'administrator' });
    const user: CreateUserDto = {
      name: fullName,
      email,
      password: adminPassword,
    };
    return await this.authService.signUp(user, [adminRole]);
  }
}
