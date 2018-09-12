import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CryptographerService } from '../../utilities/cryptographer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthData } from '../auth-data/auth-data.entity';

describe('UserService', () => {
  let service: UserService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'CryptographerService',
          useClass: CryptographerService,
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
    service = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
