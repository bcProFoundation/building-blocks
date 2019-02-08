import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from '../../../user-management/entities/role/role.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { CRUDOperationService } from '../../../common/services/crudoperation/crudoperation.service';

describe('RoleController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: CRUDOperationService,
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
