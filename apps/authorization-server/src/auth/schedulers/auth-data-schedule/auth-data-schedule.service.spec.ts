import { Test, TestingModule } from '@nestjs/testing';
import { AuthDataScheduleService } from './auth-data-schedule.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';

describe('AuthDataScheduleService', () => {
  let service: AuthDataScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthDataScheduleService,
        { provide: AuthDataService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthDataScheduleService>(AuthDataScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
