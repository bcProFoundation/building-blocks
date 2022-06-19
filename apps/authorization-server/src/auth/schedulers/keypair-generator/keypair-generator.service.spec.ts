import { Test, TestingModule } from '@nestjs/testing';
import { KeyPairGeneratorService } from './keypair-generator.service';
import { OIDCKeyService } from '../../entities/oidc-key/oidc-key.service';

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
      ],
    }).compile();
    service = module.get<KeyPairGeneratorService>(KeyPairGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
