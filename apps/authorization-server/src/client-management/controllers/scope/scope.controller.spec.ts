import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ScopeController } from './scope.controller';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';

describe('ScopeController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ScopeController],
      providers: [
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: QueryBus,
          useFactory: () => jest.fn(),
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
