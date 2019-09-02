import { Test, TestingModule } from '@nestjs/testing';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { ScopeService } from '../../../client-management/entities/scope/scope.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { AuthService } from '../../../auth/controllers/auth/auth.service';
import { CryptographerService } from '../../../common/services/cryptographer/cryptographer.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { RoleService } from '../../../user-management/entities/role/role.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { KeyPairGeneratorService } from '../../../auth/schedulers';

describe('SetupController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SetupController],
      providers: [
        { provide: SetupService, useValue: {} },
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
  });
  it('should be defined', () => {
    const controller: SetupController = module.get<SetupController>(
      SetupController,
    );
    expect(controller).toBeDefined();
  });
});
