import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { UserService } from '../../../models/user/user.service';
import { USER } from '../../../models/user/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { AUTH_DATA } from '../../../models/auth-data/auth-data.schema';

describe('RoleController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        UserService,
        {
          provide: getModelToken(USER),
          useValue: {},
        },
        {
          provide: getModelToken(AUTH_DATA),
          useValue: {},
        },
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: RoleController = module.get<RoleController>(
      RoleController,
    );
    expect(controller).toBeDefined();
  });
});
