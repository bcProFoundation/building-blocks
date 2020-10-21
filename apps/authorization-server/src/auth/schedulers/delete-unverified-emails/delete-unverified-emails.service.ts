import { Inject, Injectable } from '@nestjs/common';
import * as Agenda from 'agenda';

import { AGENDA_CONNECTION } from '../../../common/database.provider';
import { UserService } from '../../../user-management/entities/user/user.service';

export const UNVERIFIED_EMAIL_DELETE_QUEUE = 'unverified_email_delete_queue';
export const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class DeleteUnverifiedEmailsService {
  constructor(
    @Inject(AGENDA_CONNECTION)
    private readonly agenda: Agenda,
    private readonly user: UserService,
  ) {}

  async onModuleInit() {
    this.defineQueueProcess();
    await this.addQueue();
  }

  defineQueueProcess() {
    this.agenda.define(UNVERIFIED_EMAIL_DELETE_QUEUE, async job => {
      // Delete unverified emails created 24 hours ago, user must also be disabled.
      await this.user.deleteMany({
        isEmailVerified: false,
        disabled: true,
        creation: { $lt: new Date(Date.now() - TWENTY_FOUR_HOURS_MS) },
      });
    });
  }

  async addQueue() {
    const every = '6 hour';
    await this.agenda.every(every, UNVERIFIED_EMAIL_DELETE_QUEUE);
  }
}
