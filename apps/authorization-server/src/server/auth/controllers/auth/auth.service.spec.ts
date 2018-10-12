import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../../models/user/user.service';
import { AuthDataService } from '../../../models/auth-data/auth-data.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { getModelToken } from '@nestjs/mongoose';
import { AUTH_DATA } from '../../../models/auth-data/auth-data.schema';
import { USER } from '../../../models/user/user.schema';

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
          provide: getModelToken(USER),
          useValue: {}, // provide mock values
        },
        {
          provide: getModelToken(AUTH_DATA),
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
