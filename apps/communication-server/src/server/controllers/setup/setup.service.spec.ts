import { Test, TestingModule } from '@nestjs/testing';
import { SetupService } from './setup.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientService } from '../../models/client/client.service';
import { Client } from '../../models/client/client.entity';

describe('SetupService', () => {
  let service: SetupService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SetupService,
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<SetupService>(SetupService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
