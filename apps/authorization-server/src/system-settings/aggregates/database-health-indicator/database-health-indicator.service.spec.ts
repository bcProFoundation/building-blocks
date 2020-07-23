import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseHealthIndicatorService } from './database-health-indicator.service';

describe('DatabaseHealthIndicatorService', () => {
  let service: DatabaseHealthIndicatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseHealthIndicatorService],
    }).compile();

    service = module.get<DatabaseHealthIndicatorService>(
      DatabaseHealthIndicatorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
