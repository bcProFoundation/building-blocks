import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ScopeService } from '../../../models/scope/scope.service';
import { ClientService } from '../../../models/client/client.service';
import {
  SETUP_ALREADY_COMPLETE,
  INFRASTRUCTURE_CONSOLE,
  SPECIFY_SERVER_URL,
  ADMIN_PASSWORD_MISSING,
  ADMIN_USER,
} from '../../../constants/messages';
import { Client } from '../../../models/client/client.entity';
import { Scope } from '../../../models/scope/scope.entity';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../../../models/user/create-user.dto';
import { UserService } from '../../../models/user/user.service';
import { randomBytes } from 'crypto';

@Injectable()
export class SetupService {
  constructor(
    private readonly scopeService: ScopeService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async setupInfrastructureClient(serverUrl: string, adminPassword: string) {
    const existingClients = await this.clientService.find();
    const existingUsers = await this.userService.find();

    if (existingClients.length > 0 || existingUsers.length > 0) {
      throw new HttpException(SETUP_ALREADY_COMPLETE, HttpStatus.UNAUTHORIZED);
    }

    if (!serverUrl)
      throw new HttpException(SPECIFY_SERVER_URL, HttpStatus.BAD_REQUEST);

    if (!adminPassword)
      throw new HttpException(ADMIN_PASSWORD_MISSING, HttpStatus.BAD_REQUEST);

    await this.createUser(adminPassword);
    return await this.createClient(serverUrl);
  }

  async createClient(serverUrl) {
    const scope: Scope = await this.scopeService.save({ name: 'openid' });
    const createdBy = await this.userService.findOne({ email: ADMIN_USER });
    const allowedScopes: Scope[] = [];
    allowedScopes.push(scope);

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

  async createUser(adminPassword) {
    const user: CreateUserDto = {
      name: ADMIN_USER,
      email: ADMIN_USER,
      password: adminPassword,
    };
    // TODO: Setup Admin Role
    return await this.authService.signUp(user);
  }
}
