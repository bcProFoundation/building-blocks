import { Test, TestingModule } from '@nestjs/testing';
import { MicroserviceHealthIndicator } from '@nestjs/terminus';
import { HealthCheckAggregateService } from './health-check.service';
import { ConfigService } from '../../../config/config.service';
import { DatabaseHealthIndicatorService } from '../database-health-indicator/database-health-indicator.service';

describe('HealthCheckAggregateService', () => {
  let service: HealthCheckAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthCheckAggregateService,
        { provide: MicroserviceHealthIndicator, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: DatabaseHealthIndicatorService, useValue: {} },
      ],
    }).compile();

    service = module.get<HealthCheckAggregateService>(
      HealthCheckAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
