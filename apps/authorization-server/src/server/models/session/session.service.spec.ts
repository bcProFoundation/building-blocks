import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { getModelToken } from '@nestjs/mongoose';
import { SESSION } from './session.schema';

describe('SessionService', () => {
  let service: SessionService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: getModelToken(SESSION),
          useValue: {}, // use mock values
        },
      ],
    }).compile();
    service = module.get<SessionService>(SessionService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
