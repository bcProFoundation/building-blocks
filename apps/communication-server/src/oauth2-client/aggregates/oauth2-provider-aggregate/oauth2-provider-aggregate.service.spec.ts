import { Test, TestingModule } from '@nestjs/testing';
import { Oauth2ProviderAggregateService } from './oauth2-provider-aggregate.service';

describe('Oauth2ProviderAggregateService', () => {
  let service: Oauth2ProviderAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Oauth2ProviderAggregateService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<Oauth2ProviderAggregateService>(
      Oauth2ProviderAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
