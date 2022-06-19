import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import cron from 'node-cron';
import { RemoveUnverifiedUserCommand } from '../../../user-management/commands/remove-unverified-user/remove-unverified-user.command';
import { UserService } from '../../../user-management/entities/user/user.service';

export const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class DeleteUnverifiedEmailsService {
  constructor(
    private readonly user: UserService,
    private readonly commandBus: CommandBus,
  ) {}

  onModuleInit() {
    // Every hour
    cron.schedule('0 * * * *', async () => {
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
}
