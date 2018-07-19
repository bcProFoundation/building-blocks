import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { UserService } from '../../../models/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../models/user/user.entity';

describe('RoleController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
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
