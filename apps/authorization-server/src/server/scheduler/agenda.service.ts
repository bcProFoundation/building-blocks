import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Agenda from 'agenda';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AgendaService implements OnModuleInit {
  agenda: Agenda;
  constructor(private readonly configService: ConfigService) {
    this.agenda =
      process.env.NODE_ENV !== 'test'
        ? new Agenda({
            db: {
              address: `mongodb://${this.configService.get(
                'DB_HOST',
              )}/${this.configService.get('DB_NAME')}`,
              collection: 'agenda_job',
              options: { useNewUrlParser: true },
            },
          })
        : new Agenda();
  }

  onModuleInit() {
    this.agenda.start();
  }

  define(
    name: string,
    callback: (job: Agenda.Job, done: (err?: Error) => void) => void,
  ) {
    this.agenda.define(name, callback);
  }

  async every(
    interval: string,
    names: string,
    data?: Agenda.JobAttributesData,
  ) {
    await this.agenda.every(interval, names, data);
  }
}

export class MockAgendaService {
  define(
    name: string,
    callback: (job: Agenda.Job, done: (err?: Error) => void) => void,
  ) {}

  async every(
    interval: string,
    names: string,
    data?: Agenda.JobAttributesData,
  ) {}
}
