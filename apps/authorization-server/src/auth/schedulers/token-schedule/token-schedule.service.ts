import { Injectable, OnModuleInit } from '@nestjs/common';
import cron from 'node-cron';
import { THIRTY_NUMBER } from '../../../constants/app-strings';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.interface';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { OAuth2Service } from '../../controllers/oauth2/oauth2.service';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';

export const TOKEN_DELETE_QUEUE = 'token_delete';

@Injectable()
export class TokenSchedulerService implements OnModuleInit {
  constructor(
    private readonly bearerTokenService: BearerTokenService,
    private readonly settings: ServerSettingsService,
    private readonly oauth2: OAuth2Service,
  ) {}

  onModuleInit() {
    // Every hour
    cron.schedule('0 * * * *', async () => {
      const tokens = await this.bearerTokenService.getAll();
      let settings = {
        refreshTokenExpiresInDays: THIRTY_NUMBER,
      } as ServerSettings;
      try {
        settings = await this.settings.find();
      } catch (error) {}

      for (const token of tokens) {
        const accessToken = token.accessToken;
        const now = new Date();
        const exp = new Date(token.creation.getTime() + token.expiresIn * 1000);
        const refreshTokenExp = new Date(token.creation.getTime());
        refreshTokenExp.setDate(
          refreshTokenExp.getDate() + settings.refreshTokenExpiresInDays,
        );
        if (exp.valueOf() < now.valueOf() && !token.refreshToken) {
          await this.oauth2.tokenRevoke(accessToken);
        } else if (
          token.refreshToken &&
          refreshTokenExp.valueOf() < now.valueOf()
        ) {
          await this.oauth2.tokenRevoke(accessToken);
        }
      }
    });
  }
}
