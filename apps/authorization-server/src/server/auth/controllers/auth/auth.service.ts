import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import {
  userAlreadyExistsException,
  invalidOTPException,
  invalidUserException,
} from '../../../common/filters/exceptions';
import { i18n } from '../../../i18n/i18n.config';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { CryptographerService } from '../../../common/cryptographer.service';
import { UserAccountDto } from '../../../user-management/policies';
import { Role } from '../../../user-management/entities/role/role.interface';
import { User } from '../../../user-management/entities/user/user.interface';
import { AuthData } from '../../../user-management/entities/auth-data/auth-data.interface';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { PasswordPolicyService } from '../../../user-management/policies/password-policy/password-policy.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authDataService: AuthDataService,
    private readonly cryptoService: CryptographerService,
    private readonly settings: ServerSettingsService,
    private readonly passwordPolicy: PasswordPolicyService,
  ) {}

  /**
   * Creates User with hash password
   * @param user
   * @param roles
   */
  public async signUp(user: UserAccountDto, roles?: Role[]) {
    const settings = await this.settings
      .getModel()
      .find()
      .exec();
    if (
      (settings.length === 1 && settings[0].communicationServerClientId) ||
      process.env.NODE_ENV === 'production'
    ) {
      throw new BadRequestException({
        communicationEnabled: true,
        message: 'SIGNUP_VIA_EMAIL_OR_PHONE',
      });
    }
    const result = this.passwordPolicy.validatePassword(user.password);
    if (result.errors.length > 0) {
      throw new BadRequestException({
        errors: result.errors,
        message: i18n.__('Password not secure'),
      });
    }
    const UserModel = this.userService.getModel();
    const userEntity: User = new UserModel();
    userEntity.name = user.name;

    // process email field
    userEntity.email = user.email.toLowerCase().trim();
    userEntity.phone = user.phone;

    const AuthDataModel = this.authDataService.getModel();
    const authData: AuthData = new AuthDataModel();
    authData.password = await this.cryptoService.hashPassword(user.password);
    await authData.save();
    userEntity.password = authData.uuid;

    if (roles && roles.length) {
      userEntity.roles = roles.map(r => r.name);
    }

    const checkUser = await this.checkExistingUser(userEntity);

    if (checkUser) {
      await AuthDataModel.deleteOne(authData);
      throw userAlreadyExistsException;
    } else {
      return await this.userService.save(userEntity);
    }
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

      const totp = speakeasy.totp({
        secret: sharedSecret.password,
        encoding: 'base32',
        window: 6,
      });

      if (totp === code) {
        return user;
      } else if (totp !== code) {
        const otpCounter = await this.authDataService.findOne({
          uuid: user.otpCounter,
        });

        if (!otpCounter) throw invalidOTPException;

        const hotp = speakeasy.hotp({
          secret: sharedSecret.password,
          encoding: 'base32',
          counter: otpCounter.password,
        });
        if (hotp === code) return user;
        else if (hotp !== code) throw invalidOTPException;
      }
    } else {
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

  async findUserByEmailOrPhone(emailOrPhone: string) {
    return await this.userService.findUserByEmailOrPhone(emailOrPhone);
  }

  async verifyPassword(emailOrPhone: string, password: string) {
    const user = await this.findUserByEmailOrPhone(emailOrPhone);
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
    return checkPassword;
  }
}
