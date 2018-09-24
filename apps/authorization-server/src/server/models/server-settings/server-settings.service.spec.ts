import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ServerSettingsService } from './server-settings.service';
import { SERVER_SETTINGS } from './server-settings.schema';

describe('ServerSettings', () => {
  let service: ServerSettingsService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServerSettingsService,
        {
          provide: getModelToken(SERVER_SETTINGS),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<ServerSettingsService>(ServerSettingsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
