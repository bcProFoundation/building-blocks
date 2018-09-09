import { Test, TestingModule } from '@nestjs/testing';
import { IDTokenGrantService } from './id-token-grant.service';

describe('IDTokenGrantService', () => {
  let service: IDTokenGrantService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IDTokenGrantService],
    }).compile();
    service = module.get<IDTokenGrantService>(IDTokenGrantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
