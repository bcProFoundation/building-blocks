import { Test, TestingModule } from '@nestjs/testing';
import { AuthDataService } from './auth-data.service';
import { AUTH_DATA } from './auth-data.schema';

describe('AuthDataService', () => {
  let service: AuthDataService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthDataService,
        {
          provide: AUTH_DATA,
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<AuthDataService>(AuthDataService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
