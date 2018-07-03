import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { UserService } from '../../../models/user/user.service';
import { User } from '../../../models/user/user.entity';

describe('Auth Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'AuthService',
          useClass: AuthService,
        },
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
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: AuthController = module.get<AuthController>(
      AuthController,
    );
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    const controller: AuthController = module.get<AuthController>(
      AuthController,
    );
    expect(controller.login).toBeDefined();
  });

  it('should be defined', () => {
    const controller: AuthController = module.get<AuthController>(
      AuthController,
    );
    expect(controller.signup).toBeDefined();
  });

});
