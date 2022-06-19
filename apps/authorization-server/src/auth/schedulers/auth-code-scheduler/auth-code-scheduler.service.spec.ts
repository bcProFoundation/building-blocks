import { Test, TestingModule } from '@nestjs/testing';
import { AuthCodeSchedulerService } from './auth-code-scheduler.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { AuthorizationCodeService } from '../../entities/authorization-code/authorization-code.service';

describe('AuthCodeSchedulerService', () => {
  let service: AuthCodeSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthCodeSchedulerService,
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
