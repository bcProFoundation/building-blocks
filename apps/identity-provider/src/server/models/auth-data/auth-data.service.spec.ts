import { Test, TestingModule } from '@nestjs/testing';
import { AuthData } from './auth-data.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthDataService } from './auth-data.service';

describe('AuthDataService', () => {
  let service: AuthDataService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthDataService,
        {
          provide: getRepositoryToken(AuthData),
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
