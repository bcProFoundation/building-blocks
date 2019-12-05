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
  BROADCAST_HOST,
  BROADCAST_PORT,
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

    const broadcastHost = this.config.get(BROADCAST_HOST);
    const broadcastPort = this.config.get(BROADCAST_PORT)
      ? Number(this.config.get(BROADCAST_PORT))
      : undefined;
    if (broadcastHost || broadcastPort) {
      healthEndpoint.healthIndicators.push(async () =>
        this.microservice.pingCheck('broadcast-service', {
          transport: Transport.TCP,
          options: { host: broadcastHost, port: broadcastPort },
        }),
      );
    }

    return {
      endpoints: [healthEndpoint],
    };
  }
}
