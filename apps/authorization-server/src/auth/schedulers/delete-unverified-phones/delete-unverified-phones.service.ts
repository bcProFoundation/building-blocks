import { Inject, Injectable } from '@nestjs/common';
import Agenda from 'agenda';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';

import { AGENDA_CONNECTION } from '../../../common/database.provider';
import { UserService } from '../../../user-management/entities/user/user.service';
import { USER } from '../../../user-management/entities/user/user.schema';

export const UNVERIFIED_PHONE_DELETE_QUEUE = 'unverified_phone_delete_queue';
export const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class DeleteUnverifiedPhonesService {
  constructor(
    @Inject(AGENDA_CONNECTION)
    private readonly agenda: Agenda,
    private readonly user: UserService,
    private readonly authData: AuthDataService,
  ) {}

  async onModuleInit() {
    this.defineQueueProcess();
    await this.addQueue();
  }

  defineQueueProcess() {
    this.agenda.define(UNVERIFIED_PHONE_DELETE_QUEUE, async job => {
      // Delete 100 unverified phones created 24 hours ago, user must also be disabled.
      const users = await this.user.list(0, 100, undefined, {
        disabled: true,
        unverifiedPhone: { $exists: true },
        isEmailVerified: false,
        creation: { $lt: new Date(Date.now() - TWENTY_FOUR_HOURS_MS) },
      });

      users.docs.forEach(user => {
        this.user
          .delete({ uuid: user.uuid })
          .then(() =>
            this.authData.deleteMany({
              entity: USER,
              entityUuid: user.uuid,
            }),
          )
          .then(deleted => {});
      });
    });
  }

  async addQueue() {
    const every = '6 hour';
    await this.agenda.every(every, UNVERIFIED_PHONE_DELETE_QUEUE);
  }
}
