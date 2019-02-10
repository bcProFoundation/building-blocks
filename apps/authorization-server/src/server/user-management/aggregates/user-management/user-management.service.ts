import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
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
import { RoleService } from '../../../user-management/entities/role/role.service';
import { UserRoleRemovedEvent } from '../../../user-management/events/user-role-removed/user-role-removed.event';
import { ADMINISTRATOR } from '../../../constants/app-strings';

@Injectable()
export class UserManagementService extends AggregateRoot {
  constructor(
    private readonly userService: UserService,
    private readonly authDataService: AuthDataService,
    private readonly clientService: ClientService,
    private readonly bearerTokenService: BearerTokenService,
    private readonly roleService: RoleService,
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

  async deleteRole(roleName: string, actorUuid: string) {
    const role = await this.roleService.findOne({ name: roleName });
    const UserModel = this.userService.getModel();
    const usersWithRole = await UserModel.find({ roles: role.name }).exec();

    if (role.name === ADMINISTRATOR) {
      throw new BadRequestException({
        cannotDeleteRole: role.name,
      });
    }

    if (usersWithRole.length > 0) {
      throw new BadRequestException({
        usersWithRole: usersWithRole.map(user => ({
          name: user.name,
          email: user.email,
          phone: user.phone,
        })),
      });
    } else {
      await role.remove();
      this.apply(new UserRoleRemovedEvent(role, actorUuid));
    }
  }
}
