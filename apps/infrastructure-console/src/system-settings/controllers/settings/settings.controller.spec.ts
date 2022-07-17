import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

describe('Settings Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: TokenCacheService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();
  });
  it('should be defined', () => {
    const controller: SettingsController =
      module.get<SettingsController>(SettingsController);
    expect(controller).toBeDefined();
  });
});
