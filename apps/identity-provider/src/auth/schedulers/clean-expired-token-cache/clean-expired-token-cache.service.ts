import { Injectable, OnModuleInit } from '@nestjs/common';
import { CronJob } from 'cron';
import { TokenCacheService } from '../../entities/token-cache/token-cache.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

export const TOKEN_CLEANUP_CRON_STRING = '0 */15 * * * *';

@Injectable()
export class CleanExpiredTokenCacheService implements OnModuleInit {
  constructor(
    private readonly tokenCache: TokenCacheService,
    private readonly settings: ServerSettingsService,
  ) {}
  onModuleInit() {
    const job = new CronJob(TOKEN_CLEANUP_CRON_STRING, async () => {
      const settings = await this.settings.find();
      const query: { [key: string]: any } = {
        exp: { $lte: Math.floor(new Date().valueOf() / 1000) },
      };

      if (settings && settings.clientTokenUuid) {
        query.uuid = { $ne: settings.clientTokenUuid };
      }

      await this.tokenCache.deleteMany(query);
    });
    job.start();
  }
}
