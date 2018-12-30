import { TestingModule, Test } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { TokenCacheService } from '../../models/token-cache/token-cache.service';
import { TokenGuard } from '../../guards/token.guard';
import { HttpModule } from '@nestjs/common';
import { SettingsService } from './settings.service';

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
