import { Injectable, OnModuleInit } from '@nestjs/common';
import { CryptographerService } from '../utilities/cryptographer.service';
import { UserService } from './user/user.service';
import { AuthData } from './auth-data/auth-data.entity';
import { User } from './user/user.entity';
import { Role } from './role/role.entity';
import { RoleService } from './role/role.service';
import { Client } from './client/client.entity';
import { ClientService } from './client/client.service';
import { ConfigService } from 'config/config.service';

@Injectable()
export class ModelFixtures implements OnModuleInit {
  onModuleInit() {
    if (this.configService.get('IMPORT_FIXTURES')) {
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
  ) {}

  async setupAdmin() {
    // Add Role 'admin'
    const roleName = 'admin';
    const roleEntity = new Role();
    roleEntity.name = roleName;
    const localRole = await this.roleService.findOne({ name: roleName });
    if (!localRole) await this.roleService.save(roleEntity);

    // Add User
    const authData = new AuthData();
    const userEntity = new User();
    userEntity.name = 'Administrator';
    userEntity.email = 'admin@localhost';
    authData.password = await this.cryptoService.hashPassword(
      this.configService.get('ADMIN_PASSWORD'),
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
    client.name = 'Developer Portal';
    client.clientSecret = this.configService.get('CLIENT_SECRET');
    client.isTrusted = 1;
    client.redirectUri = this.configService.get('CLIENT_REDIRECT_URI');
    const localClient = await this.clientService.findOne({
      name: client.name,
      clientSecret: client.clientSecret,
      isTrusted: client.isTrusted,
      redirectUri: client.redirectUri,
    });
    if (!localClient) client.save();
  }
}
