import { Test } from '@nestjs/testing';
import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { RetrieveBrandInfoHandler } from './retrieve-brand-info.handler';
import { RetrieveBrandInfoQuery } from './retrieve-brand-info.query';
import { BrandSettingsService } from '../../entities/brand-settings/brand-settings.service';
import { BrandSettings } from '../../entities/brand-settings/brand-settings.entity';

describe('Query: RetrieveBrandInfoHandler', () => {
  let queryBus$: QueryBus;
  let brandInfo: BrandSettingsService;
  let queryHandler: RetrieveBrandInfoHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        RetrieveBrandInfoHandler,
        {
          provide: QueryBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: BrandSettingsService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    queryBus$ = module.get<QueryBus>(QueryBus);
    brandInfo = module.get<BrandSettingsService>(BrandSettingsService);
    queryHandler = module.get<RetrieveBrandInfoHandler>(
      RetrieveBrandInfoHandler,
    );
  });

  it('should be defined', () => {
    expect(queryBus$).toBeDefined();
    expect(brandInfo).toBeDefined();
    expect(queryHandler).toBeDefined();
  });

  it('should retrieve brandInfo using the BrandSettingsService', async () => {
    const brandSettings = new BrandSettings();
    brandInfo.find = jest.fn((...args) => Promise.resolve(brandSettings));
    queryBus$.execute = jest.fn();

    await queryHandler.execute(new RetrieveBrandInfoQuery());
    expect(brandInfo.find).toHaveBeenCalledTimes(1);
  });
});
