import { Injectable } from '@nestjs/common';
import cron from 'node-cron';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { USER } from '../../../user-management/entities/user/user.schema';
import { UserService } from '../../../user-management/entities/user/user.service';

export const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class DeleteUnverifiedPhonesService {
  constructor(
    private readonly user: UserService,
    private readonly authData: AuthDataService,
  ) {}

  onModuleInit() {
    // Every 6 hours
    cron.schedule('0 */6 * * *', async () => {
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
}
