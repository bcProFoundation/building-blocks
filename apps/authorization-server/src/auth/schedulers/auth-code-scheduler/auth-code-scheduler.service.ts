import { Injectable } from '@nestjs/common';
import cron from 'node-cron';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { AuthorizationCodeService } from '../../entities/authorization-code/authorization-code.service';
import { TEN_NUMBER } from '../../../constants/app-strings';

@Injectable()
export class AuthCodeSchedulerService {
  constructor(
    private readonly settings: ServerSettingsService,
    private readonly authCode: AuthorizationCodeService,
  ) {}

  onModuleInit() {
    // Every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
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
}
