import { Injectable, Inject } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { AGENDA_CONNECTION } from '../../../common/database.provider';
import * as Agenda from 'agenda';

export const AUTH_DATA_DELETE_QUEUE = 'auth_data_delete_queue';

@Injectable()
export class AuthDataScheduleService implements OnModuleInit {
  constructor(
    @Inject(AGENDA_CONNECTION)
    private readonly agenda: Agenda,
    private readonly authData: AuthDataService,
  ) {}

  async onModuleInit() {
    this.defineQueueProcess();
    await this.addQueue();
  }

  defineQueueProcess() {
    this.agenda.define(AUTH_DATA_DELETE_QUEUE, async job => {
      const authDataCollection = await this.authData.find({
        expiry: { $lt: new Date() },
      });
      for (const authData of authDataCollection) {
        await this.authData.remove(authData);
      }
    });
  }

  async addQueue() {
    const every = '1 hour';
    await this.agenda.every(every, AUTH_DATA_DELETE_QUEUE);
  }
}
