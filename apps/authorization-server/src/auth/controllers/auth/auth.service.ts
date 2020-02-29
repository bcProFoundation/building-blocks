import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import * as speakeasy from 'speakeasy';
import { v4 as uuidv4 } from 'uuid';
import {
  userAlreadyExistsException,
  invalidOTPException,
  invalidUserException,
  passwordLessLoginNotEnabledException,
} from '../../../common/filters/exceptions';
import { i18n } from '../../../i18n/i18n.config';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { CryptographerService } from '../../../common/services/cryptographer/cryptographer.service';
import { UserAccountDto } from '../../../user-management/policies';
import { Role } from '../../../user-management/entities/role/role.interface';
import { User } from '../../../user-management/entities/user/user.interface';
import {
  AuthData,
  AuthDataType,
} from '../../../user-management/entities/auth-data/auth-data.interface';
import { PasswordPolicyService } from '../../../user-management/policies/password-policy/password-policy.service';
import { SendLoginOTPCommand } from '../../commands/send-login-otp/send-login-otp.command';
import { USER } from '../../../user-management/entities/user/user.schema';
import { PasswordLessDto } from '../../policies/password-less/password-less.dto';
import { SUCCESS } from '../../../constants/app-strings';
import { addSessionUser } from '../../guards/auth.guard';

@Injectable()
export class AuthService {
  loginOTP: AuthData;

  constructor(
    private readonly userService: UserService,
    private readonly authDataService: AuthDataService,
    private readonly cryptoService: CryptographerService,
    private readonly passwordPolicy: PasswordPolicyService,
    private readonly commandBus: CommandBus,
  ) {}

  async setupAdministrator(user: UserAccountDto, roles: Role[]) {
    this.validatePassword(user);
    return this.saveUser(user, roles);
  }

  /**
   * Returns User if credentials match
   * @param email
   * @param password
   */
  public async logIn(username, password, code?) {
    const user: User = await this.userService.findUserByEmailOrPhone(username);
    const sharedSecret = await this.authDataService.findOne({
      uuid: user.sharedSecret,
    });

    if (!user) {
      throw new UnauthorizedException(i18n.__('Invalid User'));
    }

    if (user.disabled) {
      throw new UnauthorizedException(i18n.__('User Disabled'));
    }

    if (!user.password) {
      throw new UnauthorizedException(i18n.__('Unregistered User'));
    }

    const userPassword = await this.authDataService.findOne({
      uuid: user.password,
    });

    const passwordVerified = await this.cryptoService.checkPassword(
      userPassword.password,
      password,
    );

    if (!passwordVerified)
      throw new UnauthorizedException(i18n.__('Invalid Password'));

    if (user.enable2fa) {
      if (!code) throw invalidOTPException;

      const verified = this.isUserTOTPValid(sharedSecret, code);

      if (verified) {
        return user;
      } else {
        const hotp = await this.getUserHOTP(user);
        if (hotp === code) {
          await this.removeLoginHOTP();
          return user;
        } else if (hotp !== code) throw invalidOTPException;
      }
    } else {
      await this.removeLoginHOTP();
      return user;
    }
  }

  async checkExistingUser(user: User) {
    const userByEmail = await this.userService.findOne({ email: user.email });
    const userByPhone = await this.userService.findOne({ phone: user.phone });
    if (userByEmail) {
      return true;
    } else if (userByPhone) {
      return true;
    }
    return false;
  }

  /**
   * Returns User by phone
   * @param phone
   */
  async getUserByPhone(phone: string) {
    return await this.userService.findOne({ phone });
  }

  /**
   * Returns User by email
   * @param email
   */
  async getUserByEmail(email: string) {
    return await this.userService.findOne({ email });
  }

  async verifyPassword(emailOrPhone: string, password: string) {
    const user = await this.userService.findUserByEmailOrPhone(emailOrPhone);
    const passwordData = await this.authDataService.findOne({
      uuid: user.password,
    });
    if (!passwordData) throw invalidUserException;
    const checkPassword = this.cryptoService.checkPassword(
      passwordData.password,
      password,
    );
    if (!checkPassword)
      throw new UnauthorizedException(i18n.__('Invalid password'));

    if (user.enable2fa) {
      await this.commandBus.execute(new SendLoginOTPCommand(user));
    }

    return checkPassword;
  }

  async verifyUser(username: string, password?: string) {
    username = username.trim().toLocaleLowerCase();
    let user: User = await this.userService.findUserByEmailOrPhone(username);

    if (password) {
      user = await this.logIn(username, password);
      if (!user) throw new UnauthorizedException(i18n.__('Invalid password'));
    }

    user = this.userService.getUserWithoutSecrets(user);
    user = this.userService.getUserWithoutIdentity(user);
    user = this.userService.getUserWithoutMetaData(user);

    return { user };
  }

  async getUserHOTP(user: User) {
    this.loginOTP = await this.authDataService.findOne({
      entity: USER,
      entityUuid: user.uuid,
      authDataType: AuthDataType.LoginOTP,
    });

    if (!this.loginOTP) throw invalidOTPException;

    const secret = this.loginOTP.metaData.secret;
    const counter = this.loginOTP.metaData.counter;

    return speakeasy.hotp({
      secret,
      encoding: 'base32',
      counter,
    });
  }

  isUserTOTPValid(sharedSecret: AuthData, code: string) {
    if (sharedSecret) {
      return speakeasy.totp.verify({
        secret: sharedSecret.password,
        encoding: 'base32',
        token: code,
        window: 2,
      });
    }
  }

  async passwordLessLogin(payload: PasswordLessDto) {
    const user = await this.userService.findUserByEmailOrPhone(
      payload.username,
    );

    if (!user) throw invalidUserException;
    if (!user.enablePasswordLess) throw passwordLessLoginNotEnabledException;
    if (user.disabled) {
      throw new ForbiddenException(i18n.__('User Disabled'));
    }

    const sharedSecret = await this.authDataService.findOne({
      uuid: user.sharedSecret,
    });
    const verified = this.isUserTOTPValid(sharedSecret, payload.code);
    if (verified) {
      return user;
    } else {
      const htop = await this.getUserHOTP(user);
      if (htop === payload.code) {
        const code = await this.authDataService.findOne({
          entity: USER,
          entityUuid: user.uuid,
          authDataType: AuthDataType.LoginOTP,
        });
        if (!code) throw invalidOTPException;
        if (code.expiry <= new Date()) {
          this.authDataService.remove(code);
          throw invalidOTPException;
        } else {
          await this.authDataService.remove(code);
          return user;
        }
      }
      throw invalidOTPException;
    }
  }

  async saveUser(user: UserAccountDto, roles?: Role[]) {
    const userEntity = {} as User;
    userEntity.name = user.name;

    // process email field
    userEntity.email = user.email.toLowerCase().trim();
    userEntity.phone = user.phone;

    const authData = {} as AuthData;
    authData.uuid = uuidv4();
    authData.password = await this.cryptoService.hashPassword(user.password);
    await this.authDataService.save(authData);
    userEntity.password = authData.uuid;

    if (roles && roles.length) {
      userEntity.roles = roles.map(r => r.name);
    }

    const checkUser = await this.checkExistingUser(userEntity);

    if (checkUser) {
      await this.authDataService.remove(authData);
      throw userAlreadyExistsException;
    } else {
      return await this.userService.save(userEntity);
    }
  }

  validatePassword(user: UserAccountDto) {
    const result = this.passwordPolicy.validatePassword(user.password);
    if (result.errors.length > 0) {
      throw new BadRequestException({
        errors: result.errors,
        message: i18n.__('Password not secure'),
      });
    }
  }

  removeUserFromSessionUsers(req, uuid) {
    const users = req.session.users.filter(user => {
      if (user.uuid !== uuid) {
        return user;
      }
    });
    req.session.users = users;
  }

  async chooseUser(req, uuid: string) {
    if (!req.session.users) {
      req.session.users = [];
    }

    const userFromSessionUsers = req.session.users.find(user => {
      if (user.uuid === uuid) {
        return user;
      }
    });

    const reqUser = await this.userService.findOne({ uuid });
    if (!userFromSessionUsers || !reqUser) {
      throw invalidUserException;
    }

    req.session.selectedUser = uuid;
    req.logIn(reqUser, () => {});
    return userFromSessionUsers;
  }

  logout(req, res) {
    req.session.users = [];
    req.logout();
    delete req.session.selectedUser;

    if (req.query && req.query.redirect) {
      return res.redirect(req.query.redirect);
    }

    return res.redirect('/');
  }

  logoutUuid(uuid: string, req, res) {
    if (
      req.session.users &&
      req.session.users.filter(user => user.uuid === uuid).length > 0
    ) {
      req.session.users.splice(
        req.session.users.indexOf(
          req.session.users.filter(user => user && user.uuid === uuid)[0],
        ),
        1,
      );

      // Check if uuid is passport session user
      if (req.session.user && req.session.user.uuid === uuid) {
        req.logout();
        delete req.session.selectedUser;
      }
    } else {
      throw invalidUserException;
    }

    if (req.query.redirect) {
      return res.redirect(req.query.redirect);
    }

    res.json({ message: SUCCESS });
  }

  async passwordLess(payload, req) {
    const user = await this.passwordLessLogin(payload);
    addSessionUser(req, {
      uuid: user.uuid,
      email: user.email,
      phone: user.phone,
    });
    req.logIn(user, () => {});
    return {
      user: user.email,
      path: payload.redirect,
    };
  }

  async removeLoginHOTP() {
    if (this.loginOTP) {
      await this.authDataService.remove(this.loginOTP);
    }
  }
}
