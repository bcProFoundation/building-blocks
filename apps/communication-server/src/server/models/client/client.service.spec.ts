import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from './client.entity';

describe('ClientService', () => {
  let service: ClientService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: {}, // use mock values
        },
      ],
    }).compile();
    service = module.get<ClientService>(ClientService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
