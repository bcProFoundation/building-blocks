import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RoleController } from './role.controller';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';

describe('RoleController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: QueryBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: BearerTokenService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();
  });
  it('should be defined', () => {
    const controller: RoleController = module.get<RoleController>(
      RoleController,
    );
    expect(controller).toBeDefined();
  });
});
