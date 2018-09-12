import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../../models/user/user.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../models/user/user.entity';
import { AuthData } from '../../../models/auth-data/auth-data.entity';

describe('User Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: 'CryptographerService',
          useClass: CryptographerService,
        },
        {
          provide: 'UserService',
          useClass: UserService,
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
  });
  it('should be defined', () => {
    const controller: UserController = module.get<UserController>(
      UserController,
    );
    expect(controller).toBeDefined();
  });
});
