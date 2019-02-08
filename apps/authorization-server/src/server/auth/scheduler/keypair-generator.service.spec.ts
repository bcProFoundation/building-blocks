import { Test, TestingModule } from '@nestjs/testing';
import { KeyPairGeneratorService } from './keypair-generator.service';
import { OIDCKeyService } from '../../auth/entities/oidc-key/oidc-key.service';
import { ConfigService } from '../../config/config.service';

describe('KeyPairGeneratorService', () => {
  let service: KeyPairGeneratorService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeyPairGeneratorService,
        {
          provide: OIDCKeyService,
          useValue: {}, // mock
        },
        {
          provide: ConfigService,
          useValue: {
            get(...args) {},
          },
        },
      ],
    }).compile();
    service = module.get<KeyPairGeneratorService>(KeyPairGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
