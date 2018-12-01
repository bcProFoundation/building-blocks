import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from '../../../models/client/client.service';
import { UserService } from '../../../models/user/user.service';
import { CRUDOperationService } from '../common/crudoperation/crudoperation.service';

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
