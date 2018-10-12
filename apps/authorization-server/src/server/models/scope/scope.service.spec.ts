import { Test, TestingModule } from '@nestjs/testing';
import { ScopeService } from './scope.service';
import { getModelToken } from '@nestjs/mongoose';
import { SCOPE } from './scope.schema';

describe('ScopeService', () => {
  let service: ScopeService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScopeService,
        {
          provide: getModelToken(SCOPE),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<ScopeService>(ScopeService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
