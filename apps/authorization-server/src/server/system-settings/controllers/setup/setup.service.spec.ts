import { Test, TestingModule } from '@nestjs/testing';
import { SetupService } from './setup.service';
import { ScopeService } from '../../../client-management/entities/scope/scope.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { AuthService } from '../../../auth/controllers/auth/auth.service';
import { CryptographerService } from '../../../common/cryptographer.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { RoleService } from '../../../user-management/entities/role/role.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { KeyPairGeneratorService } from '../../../auth/scheduler/keypair-generator.service';

describe('SetupService', () => {
  let service: SetupService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SetupService,
        { provide: ClientService, useValue: {} },
        { provide: ScopeService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: CryptographerService, useValue: {} },
        { provide: AuthDataService, useValue: {} },
        { provide: RoleService, useValue: {} },
        { provide: ServerSettingsService, useValue: {} },
        {
          provide: KeyPairGeneratorService,
          useClass: class MockKPService {},
        },
      ],
    }).compile();
    service = module.get<SetupService>(SetupService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
