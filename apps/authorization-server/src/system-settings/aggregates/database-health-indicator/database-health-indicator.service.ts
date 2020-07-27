import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import * as mongoose from 'mongoose';

@Injectable()
export class DatabaseHealthIndicatorService extends HealthIndicator {
  async isHealthy(): Promise<HealthIndicatorResult> {
    const isHealthy = mongoose.connection.readyState === 1;
    const result = this.getStatus('database', isHealthy);

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError(this.constructor.name, result);
  }
}
