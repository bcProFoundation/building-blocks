import { Test, TestingModule } from '@nestjs/testing';
import { QueueLogService } from './queue-log.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueueLog } from './queue-log.entity';

describe('QueueLogService', () => {
  let service: QueueLogService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueLogService,
        {
          provide: getRepositoryToken(QueueLog),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<QueueLogService>(QueueLogService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
