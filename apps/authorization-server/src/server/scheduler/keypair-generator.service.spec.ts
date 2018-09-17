import { Test, TestingModule } from '@nestjs/testing';
import { KeyPairGeneratorService } from './keypair-generator.service';
import { AgendaService } from './agenda.service';
import { OIDCKeyService } from '../models/oidc-key/oidc-key.service';

describe('KeyPairGeneratorService', () => {
  let service: KeyPairGeneratorService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeyPairGeneratorService,
        {
          provide: AgendaService,
          useValue: {}, // mock
        },
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
