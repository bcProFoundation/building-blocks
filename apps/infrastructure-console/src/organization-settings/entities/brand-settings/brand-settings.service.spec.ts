import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BrandSettings } from './brand-settings.entity';
import { BrandSettingsService } from './brand-settings.service';

describe('BrandSettingsService', () => {
  let service: BrandSettingsService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandSettingsService,
        {
          provide: getRepositoryToken(BrandSettings),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<BrandSettingsService>(BrandSettingsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
