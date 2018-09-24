import { Test, TestingModule } from '@nestjs/testing';
import { BearerTokenService } from './bearer-token.service';
import { getModelToken } from '@nestjs/mongoose';
import { BEARER_TOKEN } from './bearer-token.schema';

describe('BearerTokenService', () => {
  let service: BearerTokenService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BearerTokenService,
        {
          provide: getModelToken(BEARER_TOKEN),
          useValue: {}, // use mock values
        },
      ],
    }).compile();
    service = module.get<BearerTokenService>(BearerTokenService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
