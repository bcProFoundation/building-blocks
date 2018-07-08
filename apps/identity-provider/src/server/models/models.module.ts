import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';
import { Session } from './session/session.entity';
import { SessionService } from './session/session.service';
import { UtilitiesModule } from '../utilities/utilities.module';
import { AuthorizationCodeService } from './authorization-code/authorization-code.service';
import { AuthorizationCode } from './authorization-code/authorization-code.entity';
import { Client } from './client/client.entity';
import { ClientService } from './client/client.service';
import { BearerToken } from './bearer-token/bearer-token.entity';
import { BearerTokenService } from './bearer-token/bearer-token.service';
import { Role } from './role/role.entity';
import { AuthData } from './auth-data/auth-data.entity';
import { AuthDataService } from './auth-data/auth-data.service';
import { RoleService } from './role/role.service';
import { ModelFixtures } from './model.fixtures';
import { ConfigModule } from 'config/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthData,
      AuthorizationCode,
      BearerToken,
      Client,
      Role,
      Session,
      User,
    ]),
    UtilitiesModule,
    ConfigModule,
  ],
  providers: [
    AuthDataService,
    AuthorizationCodeService,
    BearerTokenService,
    ClientService,
    RoleService,
    SessionService,
    UserService,
    ModelFixtures,
  ],
  exports: [
    AuthDataService,
    AuthorizationCodeService,
    BearerTokenService,
    ClientService,
    RoleService,
    SessionService,
    UserService,
  ],
})
export class ModelsModule {}
