import { Injectable, Inject } from '@nestjs/common';
import * as Agenda from 'agenda';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { AuthorizationCodeService } from '../../entities/authorization-code/authorization-code.service';
import { TEN_NUMBER } from '../../../constants/app-strings';
import { AGENDA_CONNECTION } from '../../../common/database.provider';

export const AUTH_CODE_DELETE_QUEUE = 'auth_code_delete_queue';

@Injectable()
export class AuthCodeSchedulerService {
  constructor(
    @Inject(AGENDA_CONNECTION)
    private readonly agenda: Agenda,
    private readonly settings: ServerSettingsService,
    private readonly authCode: AuthorizationCodeService,
  ) {}

  async onModuleInit() {
    this.defineQueueProcess();
    await this.addQueue();
  }

  defineQueueProcess() {
    this.agenda.define(AUTH_CODE_DELETE_QUEUE, async job => {
      const settings = await this.settings.findWithoutError();
      if (!settings) return;
      if (!settings.authCodeExpiresInMinutes) {
        settings.authCodeExpiresInMinutes = TEN_NUMBER;
      }

      const authCodes = await this.authCode.find({});
      for (const code of authCodes) {
        const expiry = code.creation;
        expiry.setMinutes(
          expiry.getMinutes() + settings.authCodeExpiresInMinutes,
        );

        if (new Date() > expiry) {
          await this.authCode.delete({ code: code.code });
        }
      }
    });
  }

  async addQueue() {
    const every = '15 minutes';
    await this.agenda.every(every, AUTH_CODE_DELETE_QUEUE);
  }
}
