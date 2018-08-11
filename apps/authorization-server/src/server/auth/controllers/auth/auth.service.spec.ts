import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../../models/user/user.service';
import { AuthDataService } from '../../../models/auth-data/auth-data.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../models/user/user.entity';
import { AuthData } from '../../../models/auth-data/auth-data.entity';

describe('AuthService', () => {
  let service: AuthService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'CryptographerService',
          useClass: CryptographerService,
        },
        {
          provide: 'UserService',
          useClass: UserService,
        },
        {
          provide: 'AuthDataService',
          useClass: AuthDataService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {}, // provide mock values
        },
        {
          provide: getRepositoryToken(AuthData),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
