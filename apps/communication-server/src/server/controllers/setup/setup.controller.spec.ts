import { Test, TestingModule } from '@nestjs/testing';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';
import { ClientService } from '../../models/client/client.service';
import { Client } from '../../models/client/client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SetupController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SetupController],
      providers: [
        SetupService,
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SetupController = module.get<SetupController>(
      SetupController,
    );
    expect(controller).toBeDefined();
  });
});
