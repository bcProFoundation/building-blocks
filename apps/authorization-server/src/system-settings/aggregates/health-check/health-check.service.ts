import {
  MicroserviceHealthIndicator,
  HealthIndicatorFunction,
} from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
  ConfigService,
  REDIS_HOST,
  REDIS_PORT,
} from '../../../config/config.service';
import { DatabaseHealthIndicatorService } from '../database-health-indicator/database-health-indicator.service';

export const HEALTH_ENDPOINT = '/api/healthz';

@Injectable()
export class HealthCheckAggregateService {
  constructor(
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly database: DatabaseHealthIndicatorService,
    private readonly config: ConfigService,
  ) {}

  createTerminusOptions(): HealthIndicatorFunction[] {
    const healthEndpoint: HealthIndicatorFunction[] = [
      async () => this.database.isHealthy(),
    ];

    if (this.config.get(REDIS_HOST) && this.config.get(REDIS_PORT)) {
      healthEndpoint.push(async () =>
        this.microservice.pingCheck('events', {
          transport: Transport.TCP,
          options: {
            host: this.config.get(REDIS_HOST),
            port: Number(this.config.get(REDIS_PORT)),
          },
        }),
      );
    }

    return healthEndpoint;
  }
}
