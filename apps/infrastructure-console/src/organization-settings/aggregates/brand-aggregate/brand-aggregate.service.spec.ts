import { Test, TestingModule } from '@nestjs/testing';
import { BrandAggregateService } from './brand-aggregate.service';
import { BrandSettingsService } from '../../entities/brand-settings/brand-settings.service';

describe('BrandAggregateService', () => {
  let service: BrandAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandAggregateService,
        { provide: BrandSettingsService, useValue: {} },
      ],
    }).compile();

    service = module.get<BrandAggregateService>(BrandAggregateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
