import { TestingModule, Test } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { ServerSettingsService } from '../../models/server-settings/server-settings.service';
import { TokenCacheService } from '../../models/token-cache/token-cache.service';
import { TokenGuard } from '../../guards/token.guard';

describe('SettingsController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: TokenCacheService,
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
