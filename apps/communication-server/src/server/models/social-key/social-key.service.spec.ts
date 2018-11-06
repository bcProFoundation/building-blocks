import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SocialKey } from './social-key.entity';
import { SocialKeyService } from './social-key.service';

describe('Social Key', () => {
  let service: SocialKeyService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialKeyService,
        {
          provide: getRepositoryToken(SocialKey),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<SocialKeyService>(SocialKeyService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
