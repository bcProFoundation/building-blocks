import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { HttpModule } from '@nestjs/axios';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        SettingsService,
        {
          provide: ServerSettingsService,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<SettingsService>(SettingsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
