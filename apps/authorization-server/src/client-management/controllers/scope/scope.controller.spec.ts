import { Test, TestingModule } from '@nestjs/testing';
import { ScopeController } from './scope.controller';
import { CommandBus } from '@nestjs/cqrs';
import { ScopeService } from '../../../client-management/entities/scope/scope.service';
import { CRUDOperationService } from '../../../common/services/crudoperation/crudoperation.service';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { UserService } from '../../../user-management/entities/user/user.service';

describe('ScopeController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ScopeController],
      providers: [
        {
          provide: ScopeService,
          useValue: {}, // provide mock values
        },
        {
          provide: CRUDOperationService,
          useValue: {}, // provide mock values
        },
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: UserService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({})
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();
  });
  it('should be defined', () => {
    const controller: ScopeController = module.get<ScopeController>(
      ScopeController,
    );
    expect(controller).toBeDefined();
  });
});
