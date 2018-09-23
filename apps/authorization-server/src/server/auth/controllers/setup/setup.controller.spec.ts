import { Test, TestingModule } from '@nestjs/testing';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';
import { ClientService } from '../../../models/client/client.service';
import { ScopeService } from '../../../models/scope/scope.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from '../../../models/client/client.entity';
import { Scope } from '../../../models/scope/scope.entity';
import { UserService } from '../../../models/user/user.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../../../models/user/user.entity';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { AuthDataService } from '../../../models/auth-data/auth-data.service';
import { AuthData } from '../../../models/auth-data/auth-data.entity';
import { RoleService } from '../../../models/role/role.service';
import { Role } from '../../../models/role/role.entity';
import { ServerSettings } from '../../../models/server-settings/server-settings.entity';
import { ServerSettingsService } from '../../../models/server-settings/server-settings.service';
import { KeyPairGeneratorService } from '../../../scheduler/keypair-generator.service';

describe('SetupController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SetupController],
      providers: [
        SetupService,
        ClientService,
        ScopeService,
        UserService,
        AuthService,
        CryptographerService,
        AuthDataService,
        RoleService,
        ServerSettingsService,
        {
          provide: KeyPairGeneratorService,
          useClass: class MockKPService {},
        },
        {
          provide: getRepositoryToken(Client),
          useValue: {}, // provide mock values
        },
        {
          provide: getRepositoryToken(Scope),
          useValue: {}, // provide mock values
        },
        {
          provide: getRepositoryToken(User),
          useValue: {}, // provide mock values
        },
        {
          provide: getRepositoryToken(AuthData),
          useValue: {}, // provide mock values
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {}, // provide mock values
        },
        {
          provide: getRepositoryToken(ServerSettings),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SetupController = module.get<SetupController>(
      SetupController,
    );
    expect(controller).toBeDefined();
  });
});
