import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { getModelToken } from '@nestjs/mongoose';
import { RoleService } from '../../../../server/models/role/role.service';
import { ROLE } from '../../../../server/models/role/role.schema';

describe('RoleController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        RoleService,
        {
          provide: getModelToken(ROLE),
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
