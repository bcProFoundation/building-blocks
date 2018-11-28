import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { ServerSettingsService } from '../../models/server-settings/server-settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
