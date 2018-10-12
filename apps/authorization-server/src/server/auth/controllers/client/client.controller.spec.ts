import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from '../../../models/client/client.service';
import { getModelToken } from '@nestjs/mongoose';
import { CLIENT } from '../../../models/client/client.schema';

describe('ClientController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: 'ClientService',
          useClass: ClientService,
        },
        {
          provide: getModelToken(CLIENT),
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
