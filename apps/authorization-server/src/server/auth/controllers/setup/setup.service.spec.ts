import { Test, TestingModule } from '@nestjs/testing';
import { SetupService } from './setup.service';
import { ScopeService } from '../../../models/scope/scope.service';
import { ClientService } from '../../../models/client/client.service';
import { UserService } from '../../../models/user/user.service';
import { AuthService } from '../auth/auth.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { AuthDataService } from '../../../models/auth-data/auth-data.service';
import { RoleService } from '../../../models/role/role.service';
import { ServerSettingsService } from '../../../models/server-settings/server-settings.service';
import { getModelToken } from '@nestjs/mongoose';
import { CLIENT } from '../../../models/client/client.schema';
import { SCOPE } from '../../../models/scope/scope.schema';
import { USER } from '../../../models/user/user.schema';
import { AUTH_DATA } from '../../../models/auth-data/auth-data.schema';
import { ROLE } from '../../../models/role/role.schema';
import { SERVER_SETTINGS } from '../../../models/server-settings/server-settings.schema';
import { KeyPairGeneratorService } from '../../../scheduler/keypair-generator.service';

describe('SetupService', () => {
  let service: SetupService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          provide: getModelToken(CLIENT),
          useValue: {}, // provide mock values
        },
        {
          provide: getModelToken(SCOPE),
          useValue: {}, // provide mock values
        },
        {
          provide: getModelToken(USER),
          useValue: {}, // provide mock values
        },
        {
          provide: getModelToken(AUTH_DATA),
          useValue: {}, // provide mock values
        },
        {
          provide: getModelToken(ROLE),
          useValue: {}, // provide mock values
        },
        {
          provide: getModelToken(SERVER_SETTINGS),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<SetupService>(SetupService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
