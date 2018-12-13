import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthDataService } from '../auth-data/auth-data.service';
import { ClientService } from '../client/client.service';
import { invalidUserException } from '../../auth/filters/exceptions';
import { UserDeleteRequestService } from '../../scheduler/user-delete-request.service';
import { BearerTokenService } from '../bearer-token/bearer-token.service';

@Injectable()
export class UserManagementService {
  constructor(
    private readonly userService: UserService,
    private readonly authDataService: AuthDataService,
    private readonly clientService: ClientService,
    private readonly userDeleteRequestService: UserDeleteRequestService,
    private readonly bearerTokenService: BearerTokenService,
  ) {}

  async deleteUser(uuid) {
    const user = await this.userService.findOne({ uuid });
    if (!user) invalidUserException;

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
    this.informUserDeleted(uuid);
  }

  async backupUser(uuid) {
    // TODO : Generate and Backup of user
  }

  async informUserDeleted(uuid) {
    await this.userDeleteRequestService.informClients(uuid);
  }
}