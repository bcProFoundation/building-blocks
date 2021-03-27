import { Injectable, Inject } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import Agenda from 'agenda';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { THIRTY_NUMBER } from '../../../constants/app-strings';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.interface';
import { AGENDA_CONNECTION } from '../../../common/database.provider';
import { OAuth2Service } from '../../controllers/oauth2/oauth2.service';

export const TOKEN_DELETE_QUEUE = 'token_delete';

@Injectable()
export class TokenSchedulerService implements OnModuleInit {
  constructor(
    @Inject(AGENDA_CONNECTION)
    private readonly agenda: Agenda,
    private readonly bearerTokenService: BearerTokenService,
    private readonly settings: ServerSettingsService,
    private readonly oauth2: OAuth2Service,
  ) {}

  async onModuleInit() {
    this.defineQueueProcess();
    await this.addQueue();
  }

  defineQueueProcess() {
    this.agenda.define(TOKEN_DELETE_QUEUE, async job => {
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
  async addQueue() {
    const every = '1 hour';
    await this.agenda.every(every, TOKEN_DELETE_QUEUE);
  }
}
