import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ClientController } from './client.controller';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';

describe('ClientController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: QueryBus,
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
    const controller: ClientController = module.get<ClientController>(
      ClientController,
    );
    expect(controller).toBeDefined();
  });
});
