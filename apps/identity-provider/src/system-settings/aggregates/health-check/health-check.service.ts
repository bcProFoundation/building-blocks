import {
  MicroserviceHealthIndicator,
  HealthIndicatorFunction,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
  ConfigService,
  REDIS_HOST,
  REDIS_PORT,
} from '../../../config/config.service';
import { Connection } from 'typeorm';
import { TYPEORM_DEFAULT_CONNECTION } from '../../../constants/typeorm.connection';
import { InjectConnection } from '@nestjs/typeorm';

export const HEALTH_ENDPOINT = '/api/healthz';

@Injectable()
export class HealthCheckAggregateService {
  constructor(
    @InjectConnection(TYPEORM_DEFAULT_CONNECTION)
    private readonly typeormConnection: Connection,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly database: TypeOrmHealthIndicator,
    private readonly config: ConfigService,
  ) {}

  createTerminusOptions(): HealthIndicatorFunction[] {
    const healthEndpoint: HealthIndicatorFunction[] = [
      async () =>
        this.database.pingCheck('database', {
          connection: this.typeormConnection,
        }),
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
