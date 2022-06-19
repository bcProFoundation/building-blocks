import { Injectable } from '@nestjs/common';
import cron from 'node-cron';
import { OnModuleInit } from '@nestjs/common';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';

@Injectable()
export class AuthDataScheduleService implements OnModuleInit {
  constructor(private readonly authData: AuthDataService) {}

  onModuleInit() {
    // Every hour
    cron.schedule('0 * * * *', async () => {
      const authDataCollection = await this.authData.find({
        expiry: { $lt: new Date() },
      });
      for (const authData of authDataCollection) {
        await this.authData.remove(authData);
      }
    });
  }
}
