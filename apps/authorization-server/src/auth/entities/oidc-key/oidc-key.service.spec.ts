import { Test, TestingModule } from '@nestjs/testing';
import { OIDCKeyService } from './oidc-key.service';
import { OIDC_KEY } from './oidc-key.schema';

describe('OIDCKey', () => {
  let service: OIDCKeyService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OIDCKeyService,
        {
          provide: OIDC_KEY,
          useValue: {}, // use mock values
        },
      ],
    }).compile();
    service = module.get<OIDCKeyService>(OIDCKeyService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
