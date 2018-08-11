import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from './session.entity';

describe('SessionService', () => {
  let service: SessionService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: getRepositoryToken(Session),
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
