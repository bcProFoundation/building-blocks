import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { TYPEORM_DEFAULT_CONNECTION } from '../../../constants/typeorm.connection';

@Injectable()
export class DatabaseHealthIndicatorService extends HealthIndicator {
  constructor(
    @InjectConnection(TYPEORM_DEFAULT_CONNECTION)
    private readonly connection: Connection,
  ) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const isHealthy = this.connection.isConnected;
    const result = this.getStatus('database', isHealthy);

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError(this.constructor.name, result);
  }
}
