import { Test, TestingModule } from '@nestjs/testing';
import { KeyPairGeneratorService } from './keypair-generator.service';
import { OIDCKeyService } from '../../entities/oidc-key/oidc-key.service';
import { AGENDA_CONNECTION } from '../../../common/database.provider';

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
          provide: AGENDA_CONNECTION,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<KeyPairGeneratorService>(KeyPairGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
