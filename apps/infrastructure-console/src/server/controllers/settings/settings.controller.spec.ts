import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { TokenGuard } from '../../guards/token.guard';

describe('Settings Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
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
