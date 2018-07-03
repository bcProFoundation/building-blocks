import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { Client } from './client.entity';

describe('Client', () => {
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
