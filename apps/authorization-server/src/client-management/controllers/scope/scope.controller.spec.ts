import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ScopeController } from './scope.controller';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { BearerTokenGuard } from '../../../auth/guards/bearer-token.guard';

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
      .overrideGuard(BearerTokenGuard)
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
