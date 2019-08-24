import { TestingModule, Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { SettingsService } from '../../aggregates/settings/settings.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

describe('SettingsController', () => {
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
          provide: TokenCacheService,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: TokenGuard,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();
  });
  it('should be defined', () => {
    const controller: SettingsController = module.get<SettingsController>(
      SettingsController,
    );
    expect(controller).toBeDefined();
  });
});
