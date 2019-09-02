import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import * as uuidv4 from 'uuid/v4';
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
import { randomBytes } from 'crypto';
import { ForgottenPasswordGeneratedEvent } from '../../../user-management/events/forgotten-password-generated/forgotten-password-generated.event';
import { UserAccountDto } from '../../policies';
import { i18n } from '../../../i18n/i18n.config';
import { CryptographerService } from '../../../common/services/cryptographer/cryptographer.service';
import { PasswordChangedEvent } from '../../events/password-changed/password-changed.event';
import { UserAccountModifiedEvent } from '../../events/user-account-modified/user-account-modified.event';
import { UserAccountAddedEvent } from '../../events/user-account-added/user-account-added.event';
import { PasswordPolicyService } from '../../policies/password-policy/password-policy.service';
import { RoleValidationPolicyService } from '../../policies/role-validation-policy/role-validation-policy.service';

@Injectable()
export class UserManagementService extends AggregateRoot {
  constructor(
    private readonly userService: UserService,
    private readonly authDataService: AuthDataService,
    private readonly clientService: ClientService,
    private readonly bearerTokenService: BearerTokenService,
    private readonly roleService: RoleService,
    private readonly crypto: CryptographerService,
    private readonly passwordPolicy: PasswordPolicyService,
    private readonly roleValidationPolicy: RoleValidationPolicyService,
  ) {
    super();
  }

  async deleteUser(uuid, actorUuid) {
    const user = await this.userService.findOne({ uuid });
    if (!user) throw invalidUserException;

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
    const sharedSecret = await this.authDataService.findOne({
      uuid: user.sharedSecret,
    });
    const otpCounter = await this.authDataService.findOne({
      uuid: user.otpCounter,
    });
    const twoFactorTempSecret = await this.authDataService.findOne({
      uuid: user.twoFactorTempSecret,
    });

    await this.clientService.deleteClientsByUser(user.uuid);
    await this.bearerTokenService.deleteMany({ user: user.uuid });
    user.deleted = true;
    this.apply(
      new UserAccountRemovedEvent(
        actorUuid,
        user,
        password,
        sharedSecret,
        otpCounter,
        twoFactorTempSecret,
      ),
    );
  }

  async backupUser(uuid) {
    // TODO : Generate and Backup of user
  }

  async deleteRole(roleName: string, actorUuid: string) {
    const role = await this.roleService.findOne({ name: roleName });
    if (!role) throw new NotFoundException({ invalidRole: roleName });
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
      this.apply(new UserRoleRemovedEvent(role, actorUuid));
    }
  }

  async generateForgottenPassword(emailOrPhone: string) {
    const user = await this.userService.findUserByEmailOrPhone(emailOrPhone);
    if (!user) throw new NotFoundException({ user });
    user.verificationCode = randomBytes(32).toString('hex');
    user.modified = new Date();
    this.apply(new ForgottenPasswordGeneratedEvent(user));
  }

  async addUserAccount(userData: UserAccountDto, createdBy?: string) {
    const result = this.passwordPolicy.validatePassword(userData.password);
    if (result.errors.length > 0) {
      throw new BadRequestException({
        errors: result.errors,
        message: i18n.__('Password not secure'),
      });
    }
    const user = new (this.userService.getModel())();
    user.email = userData.email;
    user.name = userData.name;
    user.phone = userData.phone;

    await this.validateRoles(userData.roles);

    user.roles = userData.roles;

    // create Password
    const authData = new (this.authDataService.getModel())();
    authData.password = this.crypto.hashPassword(userData.password);

    // link password with user
    user.password = authData.uuid;
    user.createdBy = createdBy;
    user.creation = new Date();

    // delete mongodb _id
    user._id = undefined;
    this.apply(new UserAccountAddedEvent(user, authData));
    return user;
  }

  async updateUserAccount(
    uuid: string,
    payload: UserAccountDto,
    modifiedBy?: string,
  ) {
    const user = await this.userService.findOne({ uuid });

    await this.validateRoles(payload.roles);

    user.roles = payload.roles;
    user.name = payload.name;

    // Set modification details
    user.modifiedBy = modifiedBy;
    user.modified = new Date();

    // Set disabled
    user.disabled = payload.disabled;

    // Set password if exists
    if (payload.password) {
      const result = this.passwordPolicy.validatePassword(payload.password);
      if (result.errors.length > 0) {
        throw new BadRequestException({
          errors: result.errors,
          message: i18n.__('Password not secure'),
        });
      }

      let authData = await this.authDataService.findOne({
        uuid: user.password,
      });

      if (!authData) {
        authData = new (this.authDataService.getModel())();
        authData.uuid = uuidv4();
      }

      authData.password = this.crypto.hashPassword(payload.password);
      user.password = authData.uuid;
      this.apply(new PasswordChangedEvent(authData));
    }

    this.apply(new UserAccountModifiedEvent(user));
    return user;
  }

  async validateRoles(roles: string[]) {
    // Validate Roles
    const result = await this.roleValidationPolicy.validateRoles(roles);
    if (!result) {
      const validRoles = await this.roleValidationPolicy.getValidRoles(roles);
      throw new BadRequestException({
        message: i18n.__('Invalid Roles'),
        validRoles,
      });
    }
  }
}
