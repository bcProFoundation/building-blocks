import { Test, TestingModule } from '@nestjs/testing';
import { OnlyAllowValidScopeService } from './only-allow-valid-scope.service';
import { ScopeService } from '../../entities/scope/scope.service';

describe('OnlyAllowValidScopeService', () => {
  let service: OnlyAllowValidScopeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnlyAllowValidScopeService,
        { provide: ScopeService, useValue: {} },
      ],
    }).compile();

    service = module.get<OnlyAllowValidScopeService>(
      OnlyAllowValidScopeService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
