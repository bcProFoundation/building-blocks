import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../../models/user/user.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { AuthData } from '../../../models/auth-data/auth-data.entity';
import { User } from '../../../models/user/user.entity';
import {
  INVALID_PASSWORD,
  INVALID_USER,
  USER_DISABLED,
} from '../../../constants/messages';
import {
  userAlreadyExistsException,
  invalidOTPException,
} from '../../filters/exceptions';
import { Role } from '../../../models/role/role.entity';
import { AuthDataService } from '../../../models/auth-data/auth-data.service';
import { CreateUserDto } from '../../../models/user/create-user.dto';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authDataService: AuthDataService,
    private readonly cryptoService: CryptographerService,
  ) {}

  /**
   * Creates User with hash password
   * @param user
   * @param roles
   */
  public async signUp(user: CreateUserDto, roles?: Role[]) {
    const userEntity = new User();
    userEntity.name = user.name;

    // process email field
    userEntity.email = user.email.toLowerCase().trim();
    userEntity.phone = user.phone;

    const authData = new AuthData();
    authData.password = await this.cryptoService.hashPassword(user.password);
    await authData.save();
    userEntity.password = authData.uuid;

    if (roles && roles.length) {
      userEntity.roles = roles.map(r => r.name);
    }

    const checkUser = await this.checkExistingUser(userEntity);

    if (checkUser) {
      await authData.remove();
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
    if (!user) throw new UnauthorizedException(INVALID_USER);
    if (user.disabled) throw new UnauthorizedException(USER_DISABLED);
    const userPassword = await this.authDataService.findOne({
      uuid: user.password,
    });

    const passwordVerified = await this.cryptoService.checkPassword(
      userPassword.password,
      password,
    );

    if (!passwordVerified) throw new UnauthorizedException(INVALID_PASSWORD);

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
}
