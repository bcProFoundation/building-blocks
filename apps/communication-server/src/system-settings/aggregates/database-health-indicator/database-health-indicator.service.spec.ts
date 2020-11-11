import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { TYPEORM_DEFAULT_CONNECTION } from '../../../constants/typeorm.connection';
import { DatabaseHealthIndicatorService } from './database-health-indicator.service';

describe('DatabaseHealthIndicatorService', () => {
  let service: DatabaseHealthIndicatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseHealthIndicatorService,
        {
          provide: getConnectionToken(TYPEORM_DEFAULT_CONNECTION),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DatabaseHealthIndicatorService>(
      DatabaseHealthIndicatorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
