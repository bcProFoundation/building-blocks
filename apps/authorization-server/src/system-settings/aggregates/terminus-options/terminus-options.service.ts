import {
  TerminusEndpoint,
  TerminusOptionsFactory,
  TerminusModuleOptions,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
  ConfigService,
  ES_HOST,
  DB_HOST,
  BULL_QUEUE_REDIS_HOST,
  BULL_QUEUE_REDIS_PORT,
} from '../../../config/config.service';

export const HEALTH_ENDPOINT = '/api/healthz';

@Injectable()
export class TerminusOptionsService implements TerminusOptionsFactory {
  constructor(
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly config: ConfigService,
  ) {}

  createTerminusOptions(): TerminusModuleOptions {
    const healthEndpoint: TerminusEndpoint = {
      url: HEALTH_ENDPOINT,
      healthIndicators: [
        async () =>
          this.microservice.pingCheck('database', {
            transport: Transport.TCP,
            options: { host: this.config.get(DB_HOST), port: 27017 },
          }),
        async () =>
          this.microservice.pingCheck('background-queue', {
            transport: Transport.TCP,
            options: {
              host: this.config.get(BULL_QUEUE_REDIS_HOST),
              port: Number(this.config.get(BULL_QUEUE_REDIS_PORT)),
            },
          }),
      ],
    };

    const esHost = this.config.get(ES_HOST);
    if (esHost) {
      healthEndpoint.healthIndicators.push(async () =>
        this.microservice.pingCheck('event-store', {
          transport: Transport.TCP,
          options: { host: esHost, port: 1113 },
        }),
      );
    }

    return {
      endpoints: [healthEndpoint],
    };
  }
}
