import { Test, TestingModule } from '@nestjs/testing';
import { Scope } from './scope.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScopeService } from './scope.service';

describe('ScopeService', () => {
  let service: ScopeService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScopeService,
        {
          provide: getRepositoryToken(Scope),
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
