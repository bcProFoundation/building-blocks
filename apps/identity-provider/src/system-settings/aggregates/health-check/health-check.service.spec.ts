import { Test, TestingModule } from '@nestjs/testing';
import {
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Connection } from 'typeorm';
import { HealthCheckAggregateService } from './health-check.service';
import { ConfigService } from '../../../config/config.service';

describe('HealthCheckAggregateService', () => {
  let service: HealthCheckAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthCheckAggregateService,
        { provide: MicroserviceHealthIndicator, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: Connection, useValue: {} },
        { provide: TypeOrmHealthIndicator, useValue: {} },
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
