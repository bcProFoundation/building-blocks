import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CryptographerService } from '../../utilities/cryptographer.service';
import { getModelToken } from '@nestjs/mongoose';
import { USER } from './user.schema';
import { AUTH_DATA } from '../auth-data/auth-data.schema';

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
          provide: getModelToken(USER),
          useValue: {}, // provide mock values
        },
        {
          provide: getModelToken(AUTH_DATA),
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
