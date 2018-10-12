import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../../models/user/user.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { getModelToken } from '@nestjs/mongoose';
import { USER } from '../../../models/user/user.schema';
import { AUTH_DATA } from '../../../models/auth-data/auth-data.schema';

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
          provide: getModelToken(USER),
          useValue: {}, // provide mock values
        },
        {
          provide: getModelToken(AUTH_DATA),
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
