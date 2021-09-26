import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../../entities/user/user.service';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import {
  invalidUserException,
  cannotDeleteAdministratorException,
  invalidRoleException,
  userAlreadyExistsException,
  UserDeleteDisabled,
  invalidClientException,
} from '../../../common/filters/exceptions';
import { UserAccountRemovedEvent } from '../../events/user-account-removed/user-account-removed';
import { RoleService } from '../../entities/role/role.service';
import { UserRoleRemovedEvent } from '../../events/user-role-removed/user-role-removed.event';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { randomBytes } from 'crypto';
import { ForgottenPasswordGeneratedEvent } from '../../events/forgotten-password-generated/forgotten-password-generated.event';
import { UserAccountDto } from '../../policies';
import { i18n } from '../../../i18n/i18n.config';
import { CryptographerService } from '../../../common/services/cryptographer/cryptographer.service';
import { PasswordChangedEvent } from '../../events/password-changed/password-changed.event';
import { UserAccountModifiedEvent } from '../../events/user-account-modified/user-account-modified.event';
import { UserAccountAddedEvent } from '../../events/user-account-added/user-account-added.event';
import { PasswordPolicyService } from '../../policies/password-policy/password-policy.service';
import { RoleValidationPolicyService } from '../../policies/role-validation-policy/role-validation-policy.service';
import {
  AuthData,
  AuthDataType,
} from '../../entities/auth-data/auth-data.interface';
import { Role } from '../../entities/role/role.interface';
import { UserRoleAddedEvent } from '../../events/user-role-added/user-role-added.event';
import { UserRoleModifiedEvent } from '../../events/user-role-modified/user-role-modified.event';
import { User } from '../../entities/user/user.interface';
import { UserAuthenticatorService } from '../../entities/user-authenticator/user-authenticator.service';
import { USER } from '../../entities/user/user.schema';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

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
    private readonly authenticator: UserAuthenticatorService,
    private readonly settings: ServerSettingsService,
  ) {
    super();
  }

  async deleteUserByUser(uuid: string, actorUuid: string) {
    const settings = await this.settings.find();
    if (settings.isUserDeleteDisabled) {
      throw new UserDeleteDisabled();
    }
    const user = await this.fetchUserOrThrowException(uuid);
    if (
      !(await this.userService.checkAdministrator(actorUuid)) &&
      user.uuid !== actorUuid
    ) {
      throw new ForbiddenException();
    }
    await this.deleteUser(uuid);
  }

  async deleteUserByTrustedClient(uuid: string, clientId: string) {
    const client = await this.clientService.findOne({ clientId });
    if (!client) {
      throw invalidClientException;
    }
    if (!client.isTrusted) {
      throw invalidClientException;
    }
    await this.deleteUser(uuid);
  }

  async deleteUser(uuid: string) {
    const user = await this.fetchUserOrThrowException(uuid);

    if (await this.userService.checkAdministrator(uuid)) {
      throw cannotDeleteAdministratorException;
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

    // Remove non-trusted OAuth 2.0 Clients created by user
    await this.clientService.deleteClientsByUser(user.uuid);

    // Remove user's bearer tokens
    await this.bearerTokenService.deleteMany({ user: user.uuid });

    // Remove user's authenticator keys
    await this.authenticator.deleteMany({ userUuid: user.uuid });

    // Remove user's authenticator challenges
    await this.authDataService.deleteMany({
      authDataType: AuthDataType.Challenge,
      entity: USER,
      entityUuid: user.uuid,
    });

    user.deleted = true;
    this.apply(
      new UserAccountRemovedEvent(
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
    const usersWithRole = await this.userService.find({ roles: role.name });

    this.disallowChangeOfAdminRole(role);

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

    const verificationCode =
      (await this.authDataService.findOne({
        authDataType: AuthDataType.VerificationCode,
        entity: USER,
        entityUuid: user.uuid,
      })) || ({} as AuthData & { _id: any });
    verificationCode.authDataType = AuthDataType.VerificationCode;
    verificationCode.password = randomBytes(32).toString('hex');
    verificationCode.entity = USER;
    verificationCode.entityUuid = user.uuid;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    verificationCode.expiry = new Date();
    this.apply(new ForgottenPasswordGeneratedEvent(user, verificationCode));
  }

  async addUserAccount(userData: UserAccountDto, createdBy?: string) {
    await this.validateExistingUser(userData);
    const result = this.passwordPolicy.validatePassword(userData.password);
    if (result.errors.length > 0) {
      throw new BadRequestException({
        errors: result.errors,
        message: i18n.__('Password not secure'),
      });
    }
    const user = {} as User;
    user.uuid = uuidv4();
    user.email = userData.email;
    user.name = userData.name;
    user.phone = userData.phone;

    await this.validateRoles(userData.roles);

    user.roles = userData.roles;

    // create Password
    const authData = {} as AuthData & { _id: any };
    authData.uuid = uuidv4();
    authData.password = this.crypto.hashPassword(userData.password);
    authData.authDataType = AuthDataType.Password;
    authData.entity = USER;
    authData.entityUuid = user.uuid;

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
    if (!user) throw invalidUserException;

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
        authData = {} as AuthData & { _id: any };
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

  async addRole(name: string, actorUserUuid: string) {
    const role = { name } as Role;
    const localRole = await this.roleService.findOne({ name });
    if (localRole) throw new BadRequestException({ role });
    role.uuid = uuidv4();
    this.apply(new UserRoleAddedEvent(role, actorUserUuid));
    return role;
  }

  async modifyRole(uuid: string, name: string, actorUserUuid: string) {
    const role = await this.roleService.findOne({ uuid });
    if (!role) throw invalidRoleException;

    this.disallowChangeOfAdminRole(role);

    if (role.name !== name) {
      const existingUsersWithRole = await this.userService.find({
        roles: role.name,
      });

      const existingRole = await this.roleService.findOne({ name });
      if (existingRole) throw invalidRoleException;
      if (existingUsersWithRole.length > 0) {
        throw new BadRequestException({
          existingUsersWithRole: existingUsersWithRole.map(user => ({
            email: user.email,
            phone: user.phone,
            roles: user.roles,
            uuid: user.uuid,
          })),
        });
      }
    }

    role.name = name;
    this.apply(new UserRoleModifiedEvent(role, actorUserUuid));
    return role;
  }

  async updateUserFullName(fullName: string, actorUserUuid: string) {
    const user = await this.userService.findOne({ uuid: actorUserUuid });
    if (!user) {
      throw new NotFoundException({ userUuid: actorUserUuid });
    }
    user.name = fullName;
    this.apply(new UserAccountModifiedEvent(user));
    return user;
  }

  async validateExistingUser(userData: User | UserAccountDto) {
    let localUser: User;

    if (userData.email) {
      localUser = await this.userService.findOne({ email: userData.email });
      if (localUser) throw userAlreadyExistsException;
    }

    if (userData.phone) {
      localUser = await this.userService.findOne({ phone: userData.phone });
      if (localUser) throw userAlreadyExistsException;
    }
  }

  disallowChangeOfAdminRole(role: Role) {
    if (role.name === ADMINISTRATOR) {
      throw new BadRequestException({
        cannotChangeRole: role.name,
      });
    }
  }

  async fetchUserOrThrowException(uuid: string) {
    const user = await this.userService.findOne({ uuid });
    if (!user) throw invalidUserException;
    return user;
  }
}
