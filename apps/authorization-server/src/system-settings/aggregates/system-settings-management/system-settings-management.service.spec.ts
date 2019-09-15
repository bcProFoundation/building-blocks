import { Test, TestingModule } from '@nestjs/testing';
import { SystemSettingsManagementService } from './system-settings-management.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { ConfigService } from '../../../config/config.service';

describe('SystemSettingsManagementService', () => {
  let service: SystemSettingsManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemSettingsManagementService,
        {
          provide: ClientService,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    })
      .overrideProvider(SystemSettingsManagementService)
      .useValue({})
      .compile();

    service = module.get<SystemSettingsManagementService>(
      SystemSettingsManagementService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
