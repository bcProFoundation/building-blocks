import { Test, TestingModule } from '@nestjs/testing';
import { AuthCodeSchedulerService } from './auth-code-scheduler.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { AuthorizationCodeService } from '../../entities/authorization-code/authorization-code.service';
import { AGENDA_CONNECTION } from '../../../common/database.provider';

describe('AuthCodeSchedulerService', () => {
  let service: AuthCodeSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthCodeSchedulerService,
        {
          provide: AGENDA_CONNECTION,
          useValue: {},
        },
        { provide: ServerSettingsService, useValue: {} },
        { provide: AuthorizationCodeService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthCodeSchedulerService>(AuthCodeSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
