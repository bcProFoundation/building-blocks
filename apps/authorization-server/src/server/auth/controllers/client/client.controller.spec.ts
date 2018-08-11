import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { ClientService } from '../../../models/client/client.service';
import { Client } from '../../../models/client/client.entity';

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
          provide: getRepositoryToken(Client),
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
