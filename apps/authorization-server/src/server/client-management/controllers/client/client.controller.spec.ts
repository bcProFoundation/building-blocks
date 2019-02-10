import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { CRUDOperationService } from '../../../common/services/crudoperation/crudoperation.service';
import { CommandBus } from '@nestjs/cqrs';

describe('ClientController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: ClientService,
          useValue: {}, // provide mock values
        },
        {
          provide: UserService,
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
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: ClientController = module.get<ClientController>(
      ClientController,
    );
    expect(controller).toBeDefined();
  });
});
