import { Injectable, ForbiddenException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { UserService } from '../../entities/user/user.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import {
  invalidUserException,
  cannotDeleteAdministratorException,
} from '../../../common/filters/exceptions';
import { UserAccountRemovedEvent } from '../../../user-management/events/user-account-removed/user-account-removed';

@Injectable()
export class UserManagementService extends AggregateRoot {
  constructor(
    private readonly userService: UserService,
    private readonly authDataService: AuthDataService,
    private readonly clientService: ClientService,
    private readonly bearerTokenService: BearerTokenService,
  ) {
    super();
  }

  async deleteUser(uuid, actorUuid) {
    const user = await this.userService.findOne({ uuid });
    if (!user) invalidUserException;

    if (await this.userService.checkAdministrator(uuid)) {
      throw cannotDeleteAdministratorException;
    }

    if (
      !(await this.userService.checkAdministrator(actorUuid)) &&
      user.uuid !== actorUuid
    ) {
      throw new ForbiddenException();
    }

    // Remove Auth Data
    const password = await this.authDataService.findOne({
      uuid: user.password,
    });
    if (password) await password.remove();
    const sharedSecret = await this.authDataService.findOne({
      uuid: user.sharedSecret,
    });
    if (sharedSecret) await sharedSecret.remove();
    const otpCounter = await this.authDataService.findOne({
      uuid: user.otpCounter,
    });
    if (otpCounter) await otpCounter.remove();
    const twoFactorTempSecret = await this.authDataService.findOne({
      uuid: user.twoFactorTempSecret,
    });
    if (twoFactorTempSecret) await twoFactorTempSecret.remove();
    await this.clientService.deleteClientsByUser(user.uuid);
    await this.bearerTokenService.deleteMany({ user: user.uuid });
    user.deleted = true;
    await user.remove();
    this.apply(new UserAccountRemovedEvent(user, actorUuid));
  }

  async backupUser(uuid) {
    // TODO : Generate and Backup of user
  }
}
