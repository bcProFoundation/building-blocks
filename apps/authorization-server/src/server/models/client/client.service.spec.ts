import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { CLIENT } from './client.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('Client', () => {
  let service: ClientService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: getModelToken(CLIENT),
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
