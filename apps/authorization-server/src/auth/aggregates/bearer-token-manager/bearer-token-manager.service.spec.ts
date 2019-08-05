import { Test, TestingModule } from '@nestjs/testing';
import { BearerTokenManagerService } from './bearer-token-manager.service';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';

describe('BearerTokenManagerService', () => {
  let service: BearerTokenManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BearerTokenManagerService,
        { provide: BearerTokenService, useValue: {} },
      ],
    }).compile();

    service = module.get<BearerTokenManagerService>(BearerTokenManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
