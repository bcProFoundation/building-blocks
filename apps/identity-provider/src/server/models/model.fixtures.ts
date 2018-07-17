import { Injectable, OnModuleInit } from '@nestjs/common';
import { CryptographerService } from 'utilities/cryptographer.service';
import { UserService } from './user/user.service';
import { AuthData } from './auth-data/auth-data.entity';
import { User } from './user/user.entity';
import { Role } from './role/role.entity';
import { RoleService } from './role/role.service';
import { Client } from './client/client.entity';
import { ClientService } from './client/client.service';
import { ConfigService } from 'config/config.service';
import { ADMIN_ROLE, ADMINISTRATOR_NAME, ADMIN_EMAIL } from 'constants/user';

@Injectable()
export class ModelFixtures implements OnModuleInit {
  private serverConfig: any;

  onModuleInit() {
    if (this.serverConfig.importFixtures) {
      this.setupAdmin();
      this.setupOAuth2Client();
    }
  }

  constructor(
    private readonly cryptoService: CryptographerService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly clientService: ClientService,
    private readonly configService: ConfigService,
  ) {
    this.serverConfig = configService.getConfig('server');
  }

  async setupAdmin() {
    // Add Role 'admin'
    const roleName = ADMIN_ROLE;
    const roleEntity = new Role();
    roleEntity.name = roleName;
    const localRole = await this.roleService.findOne({ name: roleName });
    if (!localRole) await this.roleService.save(roleEntity);

    // Add User
    const authData = new AuthData();
    const userEntity = new User();
    userEntity.name = ADMINISTRATOR_NAME;
    userEntity.email = ADMIN_EMAIL;
    authData.password = await this.cryptoService.hashPassword(
      this.serverConfig.adminPassword,
    );
    authData.save();
    userEntity.password = Promise.resolve(authData);

    // // Add admin role to user
    userEntity.roles = Promise.resolve([roleEntity]);
    const localUser = await this.userService.findOne({
      email: userEntity.email,
    });
    if (!localUser) await this.userService.create(userEntity);
  }

  async setupOAuth2Client() {
    const client = new Client();
    client.name = 'TEST_CLIENT';
    client.clientSecret = this.serverConfig.clientSecret;
    client.isTrusted = 1;
    client.redirectUri = this.serverConfig.clientRedirectUri;
    const localClient = await this.clientService.findOne({
      name: client.name,
      clientSecret: client.clientSecret,
      isTrusted: client.isTrusted,
      redirectUri: client.redirectUri,
    });
    if (!localClient) client.save();
  }
}
