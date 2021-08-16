import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import Agenda from 'agenda';
import { RemoveUnverifiedUserCommand } from '../../../user-management/commands/remove-unverified-user/remove-unverified-user.command';

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
    private readonly commandBus: CommandBus,
  ) {}

  async onModuleInit() {
    this.defineQueueProcess();
    await this.addQueue();
  }

  defineQueueProcess() {
    this.agenda.define(UNVERIFIED_EMAIL_DELETE_QUEUE, async job => {
      // Delete unverified emails created 24 hours ago, user must also be disabled.
      const users = await this.user.model
        .find({
          isEmailVerified: false,
          disabled: true,
          phone: { $exists: false },
          creation: { $lt: new Date(Date.now() - TWENTY_FOUR_HOURS_MS) },
        })
        .limit(10);

      for (const user of users) {
        await this.commandBus.execute(new RemoveUnverifiedUserCommand(user));
      }
    });
  }

  async addQueue() {
    const every = '1 hour';
    await this.agenda.every(every, UNVERIFIED_EMAIL_DELETE_QUEUE);
  }
}
