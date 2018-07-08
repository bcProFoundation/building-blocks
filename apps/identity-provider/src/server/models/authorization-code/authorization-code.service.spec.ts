import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthorizationCodeService } from './authorization-code.service';
import { AuthorizationCode } from './authorization-code.entity';

describe('AuthorizationCodeService', () => {
  let service: AuthorizationCodeService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationCodeService,
        {
          provide: getRepositoryToken(AuthorizationCode),
          useValue: {}, // use mock values
        },
      ],
    }).compile();
    service = module.get<AuthorizationCodeService>(AuthorizationCodeService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
