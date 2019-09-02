import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationCodeService } from './authorization-code.service';
import { AUTHORIZATION_CODE } from './authorization-code.schema';

describe('AuthorizationCodeService', () => {
  let service: AuthorizationCodeService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationCodeService,
        {
          provide: AUTHORIZATION_CODE,
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
